export default function ProductBriefPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Product Brief</h1>
        <p className="text-base text-muted mt-1">
          SafePass: AI-Powered Clinical Decision Support for Readmission Prevention
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Target User */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">1. Target User</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              The primary user is the <strong>discharge coordinator or care manager</strong>, the clinician responsible for assessing patient readiness for discharge and coordinating post-acute care. Secondary users include hospitalists reviewing discharge plans and quality officers monitoring readmission rates.
            </p>
            <p>
              <strong>Current workflow:</strong> Today, these clinicians rely on manual chart review, generic checklists, and clinical intuition to assess readmission risk. They manage 15-30 discharges per day across multiple EHR screens, with no unified view of which patients need the most attention. Social determinants (language barriers, medication access, transportation) are documented in the chart but rarely synthesized alongside clinical risk factors into an actionable risk picture.
            </p>
            <p>
              <strong>What they need:</strong> A single view that surfaces high-risk patients at admission, explains <em>why</em> they are at risk in plain language, and recommends specific interventions the coordinator can act on before discharge, without requiring them to navigate multiple chart screens or rely on memory.
            </p>
          </div>
        </section>

        {/* 2. Problem Statement */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">2. Problem Statement</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              For discharge coordinators, the problem is not a lack of data. It is a lack of synthesis. The information needed to predict which patients will bounce back within 30 days already exists in the EHR: prior utilization, comorbidity burden, medication complexity, social isolation, language barriers. But this data lives across disconnected screens and is never presented as a unified risk assessment at the moment it matters most, when intervention can still prevent a readmission.
            </p>
            <p>
              The consequences are measurable. Under the CMS Hospital Readmissions Reduction Program (HRRP), excess readmissions in CHF, COPD, pneumonia, and other conditions directly trigger financial penalties. Nationally, avoidable 30-day readmissions cost the U.S. healthcare system over $26 billion annually. But the human cost is what drives the urgency: patients discharged without adequate medication access, follow-up scheduling, or caregiver support are the ones who return, sicker, more complex, and at higher risk than before.
            </p>
            <p>
              The core failure mode is preventable. In our analysis of patient data, the top drivers of readmission were: medication non-adherence or access failures (patients who could not afford or fill prescriptions), lack of follow-up scheduling, social isolation without caregiver support, and language barriers that impede discharge education. These are not clinical mysteries. They are coordination gaps that a well-timed, well-targeted intervention could close.
            </p>
          </div>
        </section>

        {/* 6. Success Metrics */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">3. Success Metrics</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-base">Intervention Completion Rate</h3>
              <p className="text-muted mt-1">Target: &gt;60% within 90 days</p>
              <p className="mt-2">
                The percentage of AI-recommended and coordinator-added interventions that reach &quot;Completed&quot; status. This is the most direct measure of whether the tool drives action, not just awareness. A low completion rate signals either that recommendations are not actionable, the workflow is too burdensome, or coordinators lack the resources to execute. We track this in real-time on the Insights dashboard, broken down by AI vs. coordinator interventions.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-base">30-Day Readmission Rate Reduction</h3>
              <p className="text-muted mt-1">Target: 5% reduction in readmissions within 6 months</p>
              <p className="mt-2">
                The primary outcome metric. Compare risk-adjusted readmission rates before and after tool deployment. A 5% reduction in readmissions across a hospital system represents significant cost savings ($15K-$25K per avoided readmission) and improved patient outcomes. The Insights dashboard tracks outcome rates by risk tier to validate whether HIGH-risk identification correlates with actual readmission prevention.
              </p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-base">Estimated Cost Avoidance</h3>
              <p className="text-muted mt-1">Target: Demonstrable ROI within first quarter</p>
              <p className="mt-2">
                Calculated as: patients flagged x intervention completion rate x estimated prevention rate x average readmission cost ($20K). Broken down by HIGH (15% prevention rate) and MEDIUM (8% prevention rate) risk tiers. This gives hospital leadership a defensible dollar figure tied directly to coordinator actions in the tool. The calculation is transparent, and every input is visible and auditable on the Insights dashboard.
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

        {/* 3. Key Assumptions */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">4. Key Assumptions</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <ul className="space-y-3 list-disc list-inside">
              <li>
                <strong>Structured data is sufficient for meaningful risk stratification.</strong> Comorbidity burden, utilization history, social determinants, and medication complexity, available in structured EHR fields, provide reliable readmission risk signals without requiring NLP on unstructured clinical notes.
              </li>
              <li>
                <strong>Clinicians will trust transparent scoring over black-box ML.</strong> A rule-based model with visible weights and explainable factors will achieve higher adoption than an opaque model. Our scoring engine was validated against 30 patient records with 100% precision on the HIGH tier and 92.9% sensitivity. Clinicians can see exactly which factors contribute to every score.
              </li>
              <li>
                <strong>AI-generated narratives reduce cognitive load and drive action.</strong>{" "}Plain-language risk summaries and context-aware intervention recommendations translate abstract risk scores into specific actions (e.g., &quot;verify insulin supply before discharge&quot; vs. &quot;high-risk medication&quot;). This specificity is what converts awareness into action.
              </li>
              <li>
                <strong>Intervention at admission is the highest-leverage moment.</strong> While post-discharge follow-up matters, the admission-to-discharge window is where the most preventable failures can be intercepted: medication reconciliation, follow-up scheduling, social support coordination, and language-concordant discharge education.
              </li>
              <li>
                <strong>Coordinator workflows can absorb a new tool if it saves time.</strong> The tool must reduce time spent per patient on risk assessment, not add to it. If a coordinator can create a discharge action plan for a patient in minutes using the dashboard vs an hour of manual chart review, adoption follows.
              </li>
              <li>
                <strong>Feedback loops improve the model over time.</strong> Clinician feedback on AI recommendations (accept, reject, not applicable) and intervention completion tracking create a labeled dataset for continuous model calibration and identify blind spots in the scoring weights.
              </li>
            </ul>
          </div>
        </section>

        {/* 4. MVP Scope Decisions */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">5. MVP Scope Decisions</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-2">What We Built</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Patient Dashboard</strong> with risk distribution cards, sortable/filterable table, search, and date range filtering. The at-a-glance triage view coordinators need.</li>
                <li><strong>Rule-based risk scoring engine</strong> with 16 validated, weighted factors inspired by LACE/HOSPITAL indices. Transparent, auditable, deterministic.</li>
                <li><strong>AI-powered risk narratives</strong> via Claude API. Plain-language summaries, confidence levels, evidence grounding, and data gap identification.</li>
                <li><strong>AI recommended interventions</strong> with priority levels, confidence scores, and intervention status tracking (Not Started, In Progress, Completed, Not Applicable).</li>
                <li><strong>Coordinator interventions</strong> allowing care coordinators to add manual recommendations alongside AI recommendations.</li>
                <li><strong>Care coordinator assignment</strong> per patient for team accountability.</li>
                <li><strong>Tabbed patient detail view</strong> (Intervention, Assessment, Assessment Notes) organizing clinical decision-making workflow.</li>
                <li><strong>Comprehensive AI guardrails</strong> including temperature 0, closed-context prompting, cite-or-don&apos;t-say rule, no differential diagnosis, confidence levels on every claim, and mandatory AI-generated content warnings.</li>
                <li><strong>PostHog analytics integration</strong> with 23+ tracked user interactions plus server-side LLM trace logging for observability.</li>
                <li><strong>Insights dashboard</strong> with 30-day outcome rates, estimated cost avoidance by risk tier, intervention acceptance and completion rates.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What I Cut (and Why)</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>EHR integration (FHIR):</strong> Requires healthcare IT coordination and BAA agreements. Simulated with &quot;Sync EHR Patient Data&quot; to demonstrate the workflow. Architecture-ready for production.</li>
                <li><strong>Real authentication/RBAC:</strong> Not needed for prototype validation. Production would require role-based access tied to the hospital&apos;s identity provider.</li>
                <li><strong>Workflow automation:</strong> Task routing, automated notifications, and escalation paths are V2. MVP validates that the right information surfaces at the right time; automation follows once clinical value is proven.</li>
                <li><strong>Custom ML model:</strong> Synthetic dataset insufficient for training. The rule-based model validated well (100% HIGH-tier precision) and offers the explainability clinicians need for trust.</li>
                <li><strong>Post-discharge tracking:</strong> Tool operates at the admission-to-discharge window. Outcome tracking is included for retrospective analysis, but active post-discharge monitoring (follow-up calls, home health coordination) is V2.</li>
                <li><strong>Multi-language UI:</strong> Documented as equity consideration. Prototype is English; production would require localization for the patient-facing discharge education use case.</li>
                <li><strong>LOW-risk tier in Insights:</strong> Cost avoidance and intervention tracking focus on HIGH and MEDIUM risk patients where intervention has the greatest impact. LOW-risk patients are visible in the dashboard but excluded from savings calculations. Future iterations may include LOW-risk tracking as the model matures.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Next Iteration Priorities</h3>
              <ol className="space-y-2 list-decimal list-inside">
                <li><strong>EHR integration via FHIR:</strong> Replace simulated data with live patient records from Epic/Cerner. This is the critical path to production.</li>
                <li><strong>Automated alerting:</strong> Push notifications when HIGH-risk patients are admitted, routed to the assigned coordinator.</li>
                <li><strong>Outcome feedback loop:</strong> Correlate completed interventions with actual 30-day readmission outcomes to validate and calibrate the model.</li>
                <li><strong>Demographic equity dashboard:</strong> Monitor risk tier distribution by race, language, and insurance type to proactively identify bias.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 5. Data & Privacy Considerations */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">6. Data & Privacy Considerations</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-2">Data Source & Prototype Scope</h3>
              <p>
                This prototype uses entirely synthetic patient records. No real patient data, PHI, or PII is used at any stage. The synthetic data was designed to represent realistic clinical scenarios including diverse demographics, diagnoses, and social determinant profiles.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">HIPAA & Compliance (Production Requirements)</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Business Associate Agreement (BAA)</strong> required with the Claude API provider (Anthropic) and hosting infrastructure.</li>
                <li><strong>HIPAA-compliant hosting</strong> such as AWS GovCloud, Azure Healthcare, or equivalent with end-to-end encryption in transit and at rest.</li>
                <li><strong>Data minimization:</strong> Only structured fields required for risk scoring are sent to the LLM. No free-text clinical notes, no patient names, no SSNs. Patient IDs are internal identifiers only.</li>
                <li><strong>Institutional IRB review</strong> and potentially patient consent depending on CDS classification.</li>
                <li><strong>FDA regulatory pathway:</strong> As a CDS tool providing recommendations for clinician review (not autonomous action), this would likely qualify under the 21st Century Cures Act CDS exemption, but formal regulatory counsel is required.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AI-Specific Safeguards</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Temperature 0 for deterministic, reproducible outputs.</li>
                <li>Closed-context constraint: the model has NO access to information beyond the provided patient record.</li>
                <li>Cite-or-don&apos;t-say rule: every factual claim must reference a specific field from the patient record.</li>
                <li>No differential diagnosis: the model cannot suggest diagnoses the patient does not have.</li>
                <li>No fabricated citations: clinical references limited to guidelines explicitly provided in the prompt context.</li>
                <li>Confidence levels (HIGH/MODERATE/LOW) on every claim and recommendation.</li>
                <li>Calibrated uncertainty language: the model explicitly states when data is insufficient rather than speculating.</li>
                <li>Client-side evidence validation cross-references AI claims against patient record.</li>
                <li>Mandatory &quot;AI-generated content, verify against patient profile&quot; warnings on all AI outputs.</li>
                <li>Full LLM trace logging via PostHog for audit and observability.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Bias & Equity</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>The scoring model includes language barriers and insurance type as risk factors. These correlate with readmission but could disproportionately flag patients from marginalized groups. Production deployment requires ongoing bias auditing.</li>
                <li>Race is included in patient demographics for transparency but is <strong>not used as a scoring factor</strong>.</li>
                <li>Non-English language is flagged to trigger language-concordant discharge education, an equity-positive intervention, not a penalty.</li>
                <li>Next iteration includes a demographic equity dashboard to monitor for disparate impact across risk tiers.</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
