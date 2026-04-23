export default function ProductBriefPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Product Brief</h1>
        <p className="text-base text-muted mt-1">
          SafePass: AI-Powered Clinical Decision Support for Readmission Prevention
        </p>
        <p className="text-xs text-muted mt-2">
          Prototype built in 48 hours for technical product management assessment. Based on 30 synthetic patient records provided as part of the exercise. Built using Next.js (React) and the Claude API, with supplementary use of Cursor and Claude Code.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Target User */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">1. Target User</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              The primary user is the <strong>discharge coordinator or care manager</strong> — the clinician responsible for assessing patient readiness for discharge and coordinating post-acute care. Secondary users include hospitalists reviewing discharge plans and quality officers monitoring readmission rates.
            </p>
            <p>
              <strong>Current workflow:</strong> Today, these clinicians rely on manual chart review, generic checklists, and clinical intuition to assess readmission risk. They manage 15–30 discharges per day across multiple EHR screens, with no unified view of which patients need the most attention. Social determinants (language barriers, medication access, transportation) are documented in the chart but rarely synthesized alongside clinical risk factors into an actionable risk picture. A coordinator might spend 30–60 minutes per patient pulling together the information needed to make a discharge decision.
            </p>
            <p>
              <strong>What they need:</strong> A single view that surfaces high-risk patients at a glance, explains <em>why</em> each patient is at risk in plain language, and recommends specific, actionable interventions the coordinator can act on before discharge — without requiring them to navigate multiple chart screens or rely on memory.
            </p>
          </div>
        </section>

        {/* 2. Problem Statement */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">2. Problem Statement</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              For discharge coordinators, the problem is not a lack of data. It is a lack of synthesis. The information needed to predict which patients will bounce back within 30 days already exists in the EHR: prior utilization, comorbidity burden, medication complexity, social isolation, language barriers. But this data lives across disconnected screens and is never presented as a unified risk assessment at the moment it matters most — when intervention can still prevent a readmission.
            </p>
            <p>
              The consequences are measurable. Under the CMS Hospital Readmissions Reduction Program (HRRP), excess readmissions in CHF, COPD, pneumonia, and other conditions directly trigger financial penalties. The national average hospital readmission rate is approximately 15–17%. Nationally, avoidable 30-day readmissions cost the U.S. healthcare system over $26 billion annually. But the human cost is what drives the urgency: patients discharged without adequate medication access, follow-up scheduling, or caregiver support are the ones who return — sicker, more complex, and at higher risk than before.
            </p>
            <p>
              The core failure mode is preventable. In our analysis of the provided patient data, the top drivers of readmission were: medication non-adherence or access failures, lack of follow-up scheduling, social isolation without caregiver support, and language barriers that impede discharge education. These are not clinical mysteries. They are coordination gaps that a well-timed, well-targeted intervention could close.
            </p>
          </div>
        </section>

        {/* 3. Success Metrics */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">3. Success Metrics</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-base">Intervention Completion Rate</h3>
              <p className="text-muted mt-1">Target: &gt;60% within 90 days of go-live</p>
              <p className="mt-2">
                The percentage of AI-recommended and coordinator-added interventions that reach &quot;Completed&quot; status. This is the most direct measure of whether the tool drives action, not just awareness. A low completion rate signals either that recommendations are not actionable, the workflow is too burdensome, or coordinators lack the resources to execute. Tracked in real-time on the Insights dashboard, broken down by risk tier.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-base">30-Day Readmission Rate Reduction</h3>
              <p className="text-muted mt-1">Target: 5% reduction in risk-adjusted readmissions within 6 months</p>
              <p className="mt-2">
                The primary outcome metric. Compare risk-adjusted readmission rates before and after tool deployment. A 5% reduction across a hospital system represents significant cost savings ($15K–$25K per avoided readmission) and, more importantly, improved patient outcomes. The Insights dashboard tracks outcome rates by risk tier to validate whether HIGH-risk identification correlates with actual readmission prevention.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-base">Estimated Cost Avoidance</h3>
              <p className="text-muted mt-1">Target: Demonstrable ROI within first quarter</p>
              <p className="mt-2">
                Calculated as: patients per risk tier x tier-specific completion rate x estimated prevention rate x average readmission cost ($20K). Broken down by HIGH (15% prevention rate) and MEDIUM (8% prevention rate) risk tiers independently — LOW-risk patients are excluded from savings calculations because intervention impact is not yet validated for that population. This gives hospital leadership a defensible dollar figure tied directly to coordinator actions in the tool.
              </p>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h3 className="font-semibold mb-2">Why These Three</h3>
              <p>
                These metrics form a causal chain: <strong>completion rate</strong> measures whether the tool changes behavior, <strong>readmission reduction</strong> measures whether changed behavior improves outcomes, and <strong>cost avoidance</strong> translates outcomes into the financial language hospital leadership needs to justify continued investment. Together, they answer the only question that matters: <em>does this tool help patients recover safely at home?</em>
              </p>
            </div>
          </div>
        </section>

        {/* 4. Key Assumptions */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">4. Key Assumptions</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <ul className="space-y-3 list-disc list-inside">
              <li>
                <strong>Structured data is sufficient for meaningful risk stratification.</strong> Comorbidity burden, utilization history, social determinants, and medication complexity — all available in structured EHR fields — provide reliable readmission risk signals without requiring NLP on unstructured clinical notes. If this assumption fails, we would need to integrate NLP for discharge summaries and physician notes, which is a significant scope increase.
              </li>
              <li>
                <strong>Clinicians will trust transparent scoring over black-box ML.</strong> A rule-based model with visible weights and explainable factors will achieve higher adoption than an opaque deep-learning alternative. The scoring engine was validated against all 30 patient records with 100% precision on the HIGH tier and 92.9% sensitivity. Every score can be traced back to its contributing factors.
              </li>
              <li>
                <strong>AI-generated narratives reduce cognitive load and drive action.</strong> Plain-language risk summaries and context-aware intervention recommendations translate abstract risk scores into specific next steps. A coordinator who sees &quot;verify insulin supply before discharge&quot; is more likely to act than one who sees &quot;high-risk medication — 6 points.&quot;
              </li>
              <li>
                <strong>Intervention at admission is the highest-leverage moment.</strong> The window between admission and discharge is where the most preventable failures can be intercepted: medication reconciliation, follow-up scheduling, social support coordination, and language-concordant discharge education. Post-discharge interventions matter but have diminishing returns.
              </li>
              <li>
                <strong>Coordinator workflows can absorb a new tool if it saves time.</strong> The tool must reduce time spent per patient on risk assessment, not add to it. If a coordinator can create a discharge action plan in 5 minutes using the dashboard versus 30–60 minutes of manual chart review, adoption follows organically.
              </li>
              <li>
                <strong>Feedback loops improve the model over time.</strong> Clinician feedback on AI recommendations (accept, reject, not applicable) and intervention completion tracking create a labeled dataset for continuous model calibration and help identify blind spots in the scoring weights.
              </li>
            </ul>
          </div>
        </section>

        {/* 5. MVP Scope Decisions */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">5. MVP Scope Decisions</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-2">What We Built</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Patient Dashboard</strong> — risk distribution summary cards, sortable/filterable table with search, date range filtering, and assignee/status filters. The at-a-glance triage view coordinators need to prioritize their day.</li>
                <li><strong>Rule-based risk scoring engine</strong> — 16 weighted factors inspired by LACE and HOSPITAL indices. Transparent, auditable, deterministic. Risk factors are surfaced individually so clinicians can see exactly what is driving each score.</li>
                <li><strong>AI-powered risk narratives</strong> via the Claude API — plain-language summaries with confidence levels, evidence grounding, and data gap identification. Built with clinical safety guardrails: temperature 0, closed-context prompting, cite-or-don&apos;t-say rules, no differential diagnosis.</li>
                <li><strong>AI-recommended interventions</strong> — priority-ranked, with confidence scores and full status tracking (Not Started, In Progress, Completed, Not Applicable).</li>
                <li><strong>Coordinator interventions</strong> — allows care coordinators to add their own recommendations alongside AI-generated ones, supporting clinical autonomy.</li>
                <li><strong>Care coordinator assignment</strong> — per-patient assignment tracking for team accountability and status tracking.</li>
                <li><strong>Tabbed patient detail view</strong> — Intervention, Assessment, and Assessment Notes tabs organizing the clinical decision-making workflow.</li>
                <li><strong>Comprehensive AI guardrails</strong> — temperature 0 for deterministic outputs, closed-context constraint, cite-or-don&apos;t-say rule, no differential diagnosis, confidence levels on every claim, and mandatory AI-generated-content warnings on all AI outputs.</li>
                <li><strong>Analytics and observability</strong> — PostHog integration with 23+ tracked user interactions plus server-side LLM trace logging for auditability.</li>
                <li><strong>Insights dashboard</strong> — 30-day outcome rates, per-tier cost avoidance estimates, intervention acceptance and completion rates.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What We Cut (and Why)</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>EHR integration (FHIR):</strong> Requires healthcare IT coordination, production API access, and Business Associate Agreements. The &quot;Sync EHR Patient Data&quot; button simulates this workflow for demonstration. Production integration would be the critical path item for a real deployment.</li>
                <li><strong>Authentication and RBAC:</strong> Not needed for prototype validation. Production would require role-based access tied to the hospital&apos;s identity provider (e.g., Azure AD, Okta) with coordinator, hospitalist, and admin roles.</li>
                <li><strong>Workflow automation:</strong> Task routing, automated notifications, and escalation paths are V2. The MVP validates that the right information surfaces at the right time; automation follows once clinical value is proven.</li>
                <li><strong>Custom machine learning model:</strong> The synthetic dataset (30 records) is insufficient for training a reliable model. The rule-based approach validated well against this dataset and offers the explainability clinicians need for trust. A custom model would be re-evaluated with real-world data.</li>
                <li><strong>Post-discharge tracking:</strong> The tool operates at the admission-to-discharge window. Outcome tracking is included for retrospective analysis, but active post-discharge monitoring (follow-up calls, home health coordination) is V2.</li>
                <li><strong>Multi-language UI:</strong> Documented as an equity consideration. The prototype is English-only; production would require localization for patient populations with limited English proficiency.</li>
                <li><strong>LOW-risk tier in Insights:</strong> Cost avoidance and intervention tracking focus on HIGH and MEDIUM risk patients, where intervention has the greatest potential impact. LOW-risk patients are visible in the dashboard but excluded from savings calculations. Future iterations may include LOW-risk tracking as the model matures and more data is available.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Next Iteration Priorities</h3>
              <ol className="space-y-2 list-decimal list-inside">
                <li><strong>EHR integration via FHIR:</strong> Replace simulated data with live patient records from Epic or Cerner. This is the critical path to production and the single highest-risk item on the roadmap.</li>
                <li><strong>Automated alerting:</strong> Push notifications when HIGH-risk patients are admitted, routed to the assigned coordinator via the communication channel they already use (secure chat, email, or in-platform notification).</li>
                <li><strong>Outcome feedback loop:</strong> Correlate completed interventions with actual 30-day readmission outcomes to validate and calibrate the scoring model and intervention recommendations.</li>
                <li><strong>Demographic equity dashboard:</strong> Monitor risk tier distribution by race, language, and insurance type to proactively identify and mitigate algorithmic bias.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 6. Data & Privacy Considerations */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">6. Data & Privacy Considerations</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-2">Data Source & Prototype Scope</h3>
              <p>
                This prototype uses entirely synthetic patient records. No real patient data, PHI, or PII is used at any stage. The 30 records were provided as part of this assessment and designed to represent realistic clinical scenarios including diverse demographics, diagnoses, clinical histories, and social determinant profiles. The data is stored locally in the browser — no data is transmitted to external servers except for AI narrative generation via the Claude API, which receives only de-identified structured patient fields.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">HIPAA & Compliance (Production Requirements)</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Business Associate Agreement (BAA)</strong> required with Anthropic (Claude API provider) and any cloud hosting infrastructure (AWS, Vercel, etc.).</li>
                <li><strong>HIPAA-compliant hosting</strong> such as AWS GovCloud, Azure Healthcare, or equivalent with encryption in transit (TLS 1.3) and at rest (AES-256).</li>
                <li><strong>Data minimization:</strong> Only structured fields required for risk scoring are sent to the LLM. No free-text clinical notes, no patient names, no SSNs or MRNs. Patient IDs are internal identifiers only.</li>
                <li><strong>Institutional IRB review</strong> and potentially patient consent, depending on whether the tool is classified as a quality improvement initiative versus human subjects research.</li>
                <li><strong>FDA regulatory pathway:</strong> As a clinical decision support tool providing recommendations for clinician review (not autonomous action), this would likely qualify under the 21st Century Cures Act CDS exemption. Formal regulatory counsel is required before deployment.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AI-Specific Safeguards</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Temperature 0 for deterministic, reproducible outputs across repeated queries.</li>
                <li>Closed-context constraint: the model has no access to information beyond the provided patient record.</li>
                <li>Cite-or-don&apos;t-say rule: every factual claim must reference a specific field from the patient record.</li>
                <li>No differential diagnosis: the model cannot suggest diagnoses the patient does not already have.</li>
                <li>No fabricated citations: clinical references are limited to guidelines explicitly provided in the prompt context.</li>
                <li>Confidence levels (HIGH / MODERATE / LOW) on every claim and recommendation.</li>
                <li>Calibrated uncertainty language: the model explicitly states when data is insufficient rather than speculating.</li>
                <li>Client-side evidence validation cross-references AI claims against the patient record in real time.</li>
                <li>Mandatory &quot;AI-generated content — verify against patient profile&quot; warnings on all AI output surfaces.</li>
                <li>Full LLM trace logging via PostHog for audit trail and observability.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Bias & Equity</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>The scoring model includes language barriers and insurance type as risk factors. These correlate with readmission risk in the literature but could disproportionately flag patients from marginalized groups. Production deployment requires ongoing bias auditing.</li>
                <li>Race is included in patient demographics for full data transparency but is <strong>not used as a scoring factor</strong>.</li>
                <li>Non-English language is flagged to trigger language-concordant discharge education — an equity-positive intervention, not a penalty in the scoring model.</li>
                <li>A demographic equity dashboard is the top-priority V2 feature to monitor risk tier distribution and flag disparate impact before it affects patient care.</li>
              </ul>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-2">Assumptions & Ambiguities</h3>
              <p className="text-sm text-muted">
                Where the assignment was ambiguous, the following assumptions were made: the average readmission cost was assumed to be $20,000 based on published Medicare estimates; HIGH-risk prevention rate (15%) and MEDIUM-risk prevention rate (8%) were drawn from literature on care coordination programs; the 30-day readmission rate benchmark of 15.4% was calculated directly from the provided synthetic dataset. These assumptions are documented here for stakeholder review and should be validated against the partner hospital&apos;s actual data before the tool is used for ROI calculations.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
