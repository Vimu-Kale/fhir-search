"use client";

import { DocSection } from "@/components/doc-section";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";
import { FlowDiagram } from "@/components/include-flow-diagram";

function InlineCode({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <code className="bg-brand-purple/10 dark:bg-brand-purple/15 text-brand-purple dark:text-brand-purple-light px-1.5 py-0.5 rounded-md text-[13px] font-mono font-medium">
      {children}
    </code>
  );
}

export function ChainingSection() {
  return (
    <>
      <DocSection id="chaining" title="Chained Searches" level={1}>
        <p>
          Chaining allows you to search for resources based on properties of
          related resources. Instead of making multiple API calls, you can
          compose a single query that traverses resource references.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-brand-purple/20 dark:border-brand-purple/15 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-light" />
              <h4 className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
                Forward Chaining
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use the <InlineCode>.</InlineCode> (dot) operator to follow a
              reference from the <strong>searched</strong> resource to a{" "}
              <strong>related</strong> resource.
            </p>
          </div>
          <div className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-brand-teal/20 dark:border-brand-teal/15 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-teal to-brand-teal-light" />
              <h4 className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
                Reverse Chaining
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use <InlineCode>_has</InlineCode> to find resources that are{" "}
              <strong>referenced by</strong> other resources matching your
              criteria.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection id="forward-chaining" title="Forward Chaining" level={2}>
        <p>
          Forward chaining lets you search a resource by properties of another
          resource it references. The syntax uses the dot notation:{" "}
          <InlineCode>reference-parameter.target-parameter=value</InlineCode>
        </p>
        <CodeBlock
          language="bash"
          title="Forward Chaining Examples"
          code={`# Find observations for patients named "Smith"
GET /Observation?subject:Patient.name=Smith

# Find observations where the patient's MRN is 12345
GET /Observation?subject:Patient.identifier=http://example.org/mrn|12345

# Find conditions for patients born before 1980
GET /Condition?subject:Patient.birthdate=lt1980-01-01`}
        />
        <div className="my-6 rounded-xl border-2 border-brand-purple/15 dark:border-brand-purple/10 overflow-hidden bg-white/50 dark:bg-black/20">
          <div className="px-4 py-3 bg-brand-purple/5 dark:bg-brand-purple/10 border-b border-brand-purple/10">
            <h4 className="text-sm font-semibold text-brand-purple dark:text-brand-purple-light font-[family-name:var(--font-poppins)]">
              Forward Chaining Flow
            </h4>
          </div>
          <div className="p-2">
            <FlowDiagram type="chain" />
          </div>
        </div>
        <Callout type="info" title="Multi-level Forward Chaining">
          Some servers support multi-level chaining (e.g.,{" "}
          <InlineCode>Observation?subject.organization.name=Acme</InlineCode>).
          However, deep chains can be expensive — limit to 2-3 levels.
        </Callout>
      </DocSection>

      <DocSection id="reverse-chaining" title="Reverse Chaining with _has" level={2}>
        <p>
          Reverse chaining uses the <InlineCode>_has</InlineCode> parameter to
          select resources based on other resources that reference them. The
          syntax is:{" "}
          <InlineCode>
            _has:[ResourceType]:[reference-parameter]:[search-parameter]=value
          </InlineCode>
        </p>
        <CodeBlock
          language="bash"
          title="Reverse Chaining Examples"
          code={`# Find patients who have an Observation with code = 1234
GET /Patient?_has:Observation:subject:code=1234

# Find patients who have a completed MedicationRequest
GET /Patient?_has:MedicationRequest:subject:status=completed

# Find practitioners who have authored an active CarePlan
GET /Practitioner?_has:CarePlan:author:status=active`}
        />
        <div className="my-6 rounded-xl border-2 border-brand-teal/15 dark:border-brand-teal/10 overflow-hidden bg-white/50 dark:bg-black/20">
          <div className="px-4 py-3 bg-brand-teal/5 dark:bg-brand-teal/10 border-b border-brand-teal/10">
            <h4 className="text-sm font-semibold text-brand-teal dark:text-brand-teal-light font-[family-name:var(--font-poppins)]">
              Reverse Chaining Flow
            </h4>
          </div>
          <div className="p-2">
            <FlowDiagram type="revchain" />
          </div>
        </div>
      </DocSection>

      <DocSection id="nested-reverse-chaining" title="Nested Reverse Chaining" level={2}>
        <p>
          <InlineCode>_has</InlineCode> can be nested to traverse multiple
          levels of reverse references:
        </p>
        <CodeBlock
          language="bash"
          title="Nested Reverse Chaining"
          code={`# Find patients who have an Observation that has a Provenance
# with a specific agent
GET /Patient?_has:Observation:subject:_has:Provenance:target:agent=Practitioner/123`}
        />
        <Callout type="warning" title="Performance Impact">
          Nested reverse chaining can be computationally expensive. Each
          nesting level adds a join to the query. Most servers limit chaining
          depth to 3-4 levels.
        </Callout>
      </DocSection>

      <DocSection id="combined-chaining" title="Combining Forward & Reverse Chains" level={2}>
        <p>
          You can combine forward and reverse chaining in the same query.
          Forward chains follow references <strong>from</strong> the target
          resource, while <InlineCode>_has</InlineCode> finds resources
          referenced <strong>by</strong> another resource.
        </p>
        <CodeBlock
          language="bash"
          title="Combined Chaining Example"
          code={`# Patients managed by organization "Acme"
# who also have a high-risk Observation
GET /Patient?organization.name=Acme&_has:Observation:subject:code=high-risk`}
        />
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-brand-purple/5 dark:bg-brand-purple/[0.06] border border-brand-purple/20 dark:border-brand-purple/15 rounded-xl p-4">
            <div className="font-semibold text-xs text-brand-purple dark:text-brand-purple-light mb-2">
              Forward Chain
            </div>
            <div className="text-[11px] text-muted-foreground leading-snug">
              <InlineCode>organization.name=Acme</InlineCode>
              <br />
              <span className="mt-1 block">
                Follows Patient → Organization, filters by name
              </span>
            </div>
          </div>
          <div className="bg-brand-teal/5 dark:bg-brand-teal/[0.06] border border-brand-teal/20 dark:border-brand-teal/15 rounded-xl p-4">
            <div className="font-semibold text-xs text-brand-teal dark:text-brand-teal-light mb-2">
              Reverse Chain (_has)
            </div>
            <div className="text-[11px] text-muted-foreground leading-snug">
              <InlineCode>_has:Observation:subject:code=high-risk</InlineCode>
              <br />
              <span className="mt-1 block">
                Finds patients referenced by matching Observations
              </span>
            </div>
          </div>
        </div>
      </DocSection>
    </>
  );
}
