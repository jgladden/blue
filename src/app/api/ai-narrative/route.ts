import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { scorePatient } from "@/lib/scoring";
import type { Patient } from "@/lib/types";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompts";
import { getPostHogServer } from "@/lib/posthog-server";
import type { AINarrative } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const traceId = crypto.randomUUID();

  try {
    const body = await request.json();
    const patient = body.patient as Patient | undefined;
    const patient_id = patient?.patient_id;

    if (!patient || !patient_id) {
      return NextResponse.json(
        { error: "patient data is required" },
        { status: 400 }
      );
    }

    const risk = scorePatient(patient);
    const patientJson = JSON.stringify(patient, null, 2);
    const userMessage = buildUserMessage(
      patientJson,
      risk.total,
      risk.level,
      risk.factors.map((f) => `${f.label}: +${f.points}`)
    );

    const startTime = Date.now();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const latencyMs = Date.now() - startTime;

    // Extract text content
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      captureTrace({
        traceId,
        patientId: patient_id,
        model: "claude-sonnet-4-6",
        systemPrompt: SYSTEM_PROMPT,
        userMessage,
        latencyMs,
        status: "error",
        error: "No text response from Claude",
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
      });
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let narrative: AINarrative;
    try {
      let jsonText = textBlock.text.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "");
      }
      narrative = JSON.parse(jsonText);
    } catch {
      captureTrace({
        traceId,
        patientId: patient_id,
        model: "claude-sonnet-4-6",
        systemPrompt: SYSTEM_PROMPT,
        userMessage,
        output: textBlock.text,
        latencyMs,
        status: "error",
        error: "Failed to parse Claude response as JSON",
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
      });
      return NextResponse.json(
        {
          error: "Failed to parse Claude response as JSON",
          raw: textBlock.text,
        },
        { status: 500 }
      );
    }

    captureTrace({
      traceId,
      patientId: patient_id,
      model: "claude-sonnet-4-6",
      systemPrompt: SYSTEM_PROMPT,
      userMessage,
      output: textBlock.text,
      latencyMs,
      status: "success",
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      narrative,
    });

    return NextResponse.json({
      narrative,
      trace_id: traceId,
      latency_ms: latencyMs,
      input_tokens: response.usage?.input_tokens ?? null,
      output_tokens: response.usage?.output_tokens ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    captureTrace({
      traceId,
      patientId: "unknown",
      model: "claude-sonnet-4-6",
      systemPrompt: SYSTEM_PROMPT,
      userMessage: "",
      latencyMs: 0,
      status: "error",
      error: message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

interface TraceParams {
  traceId: string;
  patientId: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  output?: string;
  latencyMs: number;
  status: "success" | "error";
  error?: string;
  inputTokens?: number;
  outputTokens?: number;
  narrative?: AINarrative;
}

function captureTrace(params: TraceParams) {
  const posthog = getPostHogServer();
  if (!posthog) return;

  // Capture as an LLM generation event using PostHog's AI observability format
  posthog.capture({
    distinctId: "aiclin-system",
    event: "$ai_generation",
    properties: {
      $ai_trace_id: params.traceId,
      $ai_model: params.model,
      $ai_provider: "anthropic",
      $ai_input_tokens: params.inputTokens ?? null,
      $ai_output_tokens: params.outputTokens ?? null,
      $ai_latency: params.latencyMs / 1000,
      $ai_is_error: params.status === "error",
      $ai_error: params.error ?? null,
      $ai_temperature: 0,
      $ai_max_tokens: 4096,

      // Input messages
      $ai_input: [
        { role: "system", content: params.systemPrompt },
        { role: "user", content: params.userMessage },
      ],

      // Output
      $ai_output_choices: params.output
        ? [{ role: "assistant", content: params.output }]
        : [],

      // Custom properties
      patient_id: params.patientId,
      confidence_level: params.narrative?.confidence_level ?? null,
      risk_factors_count: params.narrative?.key_risk_factors?.length ?? 0,
      interventions_count:
        params.narrative?.recommended_interventions?.length ?? 0,
      data_gaps_count: params.narrative?.data_gaps?.length ?? 0,
    },
  });

  // Flush to ensure the event is sent before the response returns
  posthog.flush();
}
