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

        {/* Stakeholders & Contributors */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Stakeholders &amp; Contributors</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-1">Product Team Members</h3>
              <p>Marketing Lead, Product Manager, Engineering Lead, UX/UI Designer</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Decision Makers</h3>
              <p>Hospital Leadership: Chief Information Officer, Chief Financial Officer, CMO, CNO</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">End-Users</h3>
              <p>Care Manager, Quality Officer</p>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Problem Statement</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-1">The Why</h3>
              <p>
                A large hospital system has approached us with a problem: too many patients are being readmitted within 30 days of discharge, driving up costs, hurting quality scores, and, most importantly, indicating that patients aren't getting what they need to recover safely at home. They've asked us to build an AI-powered clinical decision support tool that helps care teams identify high-risk patients before discharge and take action to prevent avoidable readmissions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Value Proposition</h3>

              <p>
                Reduce HRRP financial penalties, improve patient outcomes, and deliver measurable ROI through avoided readmissions.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Objectives & Success Metrics */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Objectives &amp; Success Metrics</h2>
          <div className="space-y-4 text-sm leading-relaxed">

            <div>
              <h3 className="font-semibold mb-2">Goals</h3>
              <p>Equip care managers with a unified risk assessment and intervention planning tool that reduces avoidable 30-day readmissions by surfacing actionable insights.</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-base">KPIs</h3>
              <ul className="space-y-2 mt-2 list-disc list-inside">
                <li><strong>Intervention Completion Rate</strong> (Target: &gt;60% high risk patients within 90 days) — measures whether the tool drives action, not just awareness.</li>
                <li><strong>30-Day Readmission Rate Reduction</strong> (Target: 2% reduction within 6 months) — the primary outcome metric, compared against risk-adjusted baseline.</li>
                <li><strong>Estimated Cost Avoidance</strong> (Target: demonstrable ROI within first quarter) — calculated as patients per risk tier x completion rate x prevention rate x average readmission cost ($20K).</li>
              </ul>
            </div>

          </div>
        </section>

        {/* 4. Target Audience / Personas */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Target Audience / Personas</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold">Primary: Care Manager</h3>
              <p className="mt-1">The clinician responsible for assessing patient readiness for discharge and coordinating post-acute care. Manages 15–30 discharges per day across multiple EHR screens. Needs a unified view of patient risk without manual chart review.</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold">Secondary: Quality Officer</h3>
              <p className="mt-1">Monitors readmission rates and intervention effectiveness at the population level. Needs aggregate analytics and outcome tracking.</p>
            </div>
          </div>
        </section>

        {/* 5. Requirements & User Stories */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Requirements</h2>
          <div className="space-y-4 text-sm leading-relaxed">

            <div>
              <h3 className="font-semibold mb-2">Must-Have</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Patient Dashboard:</strong> Risk distribution summary cards, sortable/filterable table with search, date range filtering, assignee/status filters.</li>
                <li><strong>Rule-based risk scoring engine:</strong> 16 weighted factors inspired by LACE and HOSPITAL indices. Transparent, auditable, deterministic.</li>
                <li><strong>AI-powered risk narratives:</strong> Plain-language summaries with confidence levels, evidence grounding, and data gap identification.</li>
                <li><strong>AI-recommended interventions:</strong> Priority-ranked with confidence scores and full status tracking.</li>
                <li><strong>Care manager interventions:</strong> Allow care managers to add their own recommendations alongside AI-generated ones.</li>
                <li><strong>Care manager assignment:</strong> Per-patient assignment tracking.</li>
                <li><strong>Tabbed patient detail view:</strong> Intervention, Assessment, and Assessment Notes tabs.</li>
                <li><strong>Insights dashboard:</strong> 30-day outcome rates, per-tier cost avoidance estimates, intervention acceptance and completion rates.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Should-Have</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Analytics and observability:</strong> PostHog integration with user interaction tracking plus server-side LLM trace logging.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Could-Have</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Automated alerting (push notifications for HIGH-risk admissions).</li>
                <li>Outcome feedback loop correlating completed interventions with actual readmission outcomes.</li>
                <li>Demographic equity dashboard to monitor risk tier distribution by race, language, and insurance type.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Won't-Have (V2+)</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>EHR integration via FHIR — requires healthcare IT coordination and BAAs.</li>
                <li>Automated patient assignment — deferred to manual self-assignment via dashboard.</li>
                <li>Custom ML model — re-evaluated with real-world data.</li>
                <li>Post-discharge tracking — scope limited to admission-to-discharge window.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* User Stories */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Stories</h2>
          <div className="space-y-4 text-sm leading-relaxed">

            <div>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>As a</strong> care manager, <strong>I want</strong> to see all my patients sorted by readmission risk <strong>so that I can</strong> prioritize my rounds on the highest-need patients.</li>
                <li><strong>As a</strong> care manager, <strong>I want</strong> to understand <em>why</em> a patient is high-risk in plain language <strong>so that I can</strong> act on the specific drivers rather than guessing.</li>
                <li><strong>As a</strong> care manager, <strong>I want</strong> AI-suggested interventions with confidence scores <strong>so that I can</strong> quickly decide which recommendations to pursue.</li>
                <li><strong>As a</strong> care manager, <strong>I want</strong> to add my own interventions <strong>so that the</strong> care plan reflects my clinical judgment.</li>
                <li><strong>As a</strong> quality officer, <strong>I want</strong> to see aggregate readmission rates and cost avoidance <strong>so that I can</strong> report ROI to leadership and justify continued investment.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Edge Cases</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Insufficient data:</strong> Patient record missing key fields — the AI should state uncertainty rather than speculate.</li>
                <li><strong>Conflicting interventions:</strong> AI recommendation differs from care manager judgment — care manager override must be supported.</li>
                <li><strong>Empty state:</strong> No patients assigned — dashboard should show a clear onboarding state.</li>
                <li><strong>Stale data:</strong> Patient information not updated since last encounter — surface last-updated timestamps.</li>
                <li><strong>LLM failure:</strong> Claude API unavailable — show fallback rule-based risk summary without AI narratives.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Technical & System Requirements */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Technical &amp; System Requirements</h2>
          <div className="space-y-4 text-sm leading-relaxed">

            <div>
              <h3 className="font-semibold mb-2">Non-Functional Requirements</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Performance:</strong> Patient dashboard must load in under 2 seconds. LLM response optimized for speed (token efficiency as a secondary concern).</li>
                <li><strong>Security:</strong> No PHI or PII stored in prototype. Production requires HIPAA-compliant hosting (TLS 1.3, AES-256), BAAs with all vendors, and data minimization practices.</li>
                <li><strong>Scalability:</strong> Architecture must support scaling to hospital patient populations (thousands of active patients).</li>
                <li><strong>Compliance:</strong> Must follow clinical safety guardrails: temperature 0 for deterministic outputs, closed-context constraint, cite-or-don't-say rules, no differential diagnosis.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dependencies</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>EHR system (production):</strong> FHIR API access from Epic or Cerner. Requires healthcare IT coordination and BAA.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Timeline */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Timeline (Aggressive)</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-1">Week 1-2: Research &amp; Definition</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Share prototype with customer for sign-off</li>
                <li>Make revisions to features and scope</li>
                <li>Finalize user stories and acceptance criteria</li>
                <li>Engineering and design lead review</li>
                <li>Prioritize for next release cycle</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Week 3-4: Development</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Finalize API contracts and data models</li>
                <li>Frontend and backend engineering implementation</li>
                <li>Daily standups to address blocker questions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Week 5-6: QA, UAT, and Launch</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>User acceptance testing (UAT) with care managers</li>
                <li>Quality Assurance testing: Stress and load testing, manual and automated E2E, LLM output validation, clinical accuracy benchmarking</li>
                <li>Deployment and monitoring</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8. Risks & Constraints */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Risks &amp; Constraints</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Technical Risks</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>LLM hallucination:</strong> Mitigated by temperature 0, closed-context prompting, cite-or-don't-say rules, and client-side evidence validation.</li>
                <li><strong>EHR integration complexity:</strong> FHIR APIs vary significantly between vendors. This is the critical path to production.</li>
                <li><strong>Data quality:</strong> Real EHR data may be incomplete or inconsistent. The system must degrade gracefully.</li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Business Constraints</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>No production infrastructure:</strong> No BAA, no HIPAA-compliant hosting, no IRB review. Prototype for demonstration only.</li>
                <li><strong>Rule-based model limitations:</strong> Weights and factors may not generalize across different case mixes.</li>
                <li><strong>Adoption risk:</strong> Tool must save care managers time (5 min vs. 30–60 min per patient) or adoption will fail.</li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Bias &amp; Equity Considerations</h3>
              <p>
                Language barriers and insurance type are included as scoring factors. These correlate with readmission risk in the literature but could disproportionately flag marginalized groups. Race is displayed for transparency but not used as a scoring factor. Production requires ongoing bias auditing.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Open Questions */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Open Questions</h2>
          <div className="space-y-4 text-sm leading-relaxed">

            <div>
              <ul className="space-y-2 list-disc list-inside">
                <li>What is the current workflow for assigning care managers patients?</li>
                <li>What is the partner hospital's actual readmission rate and average cost per readmission? (Currently using published Medicare estimates.)</li>
                <li>Is this tool classified as a quality improvement initiative or human subjects research — does it require IRB review?</li>
                <li>Does the CDS exemption under the 21st Century Cures Act apply, or is FDA regulatory review needed?</li>
                <li>What identity provider (Azure AD, Okta) does the hospital use for RBAC integration?</li>
                <li>What is the care manager's actual workflow time per patient in the target hospital system?</li>
                <li>Which EHR vendor (Epic, Cerner) and FHIR version is in use at the deployment site?</li>
              </ul>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-2">Assumptions</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Extensive intel gathering; budget, timeline, pain points, competing solutions, success metrics, and stakeholder alignment.</li>
                <li>Approved by hospital IT and current software is compatible with integrating the app into the workflow.</li>
                <li>Cost analysis of high volume LLM usage has been completed.</li>
                <li>Consultation with legal and compliance teams to ensure that the app meets all regulatory requirements.</li>
                <li>Urgency, an aggressive timeline is neccessary to ensure the success of the project.</li>
                <li>Development timeline discussed and approved by lead engineer.</li>
                <li>Hospital identified the care manager caseload and intervention tracking as a primary contributor to readmission.</li>
                <li>The admission date signals that a doctor has made a diagnosis and prescribed necessary treatment.</li>
                <li>Average readmission cost: $20,000 (based on published Medicare estimates).</li>
                <li>HIGH-risk prevention rate: 15%, MEDIUM-risk prevention rate: 8% (drawn from care coordination program literature).</li>
                <li>Baseline 30-day readmission rate: 15.4% (calculated from the provided synthetic dataset).</li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
