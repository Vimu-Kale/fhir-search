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

export function IncludingResourcesSection() {
  return (
    <>
      <DocSection id="including-resources" title="Including Linked Resources" level={1}>
        <p>
          When searching for FHIR resources, you often need related resources
          as well. For example, when searching for Observations, you may also
          need the Patient associated with each observation. FHIR provides{" "}
          <InlineCode>_include</InlineCode> and{" "}
          <InlineCode>_revinclude</InlineCode> parameters to request related
          resources in a single query.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-brand-purple/20 dark:border-brand-purple/15 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-light" />
              <h4 className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
                _include
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Includes resources that the search results{" "}
              <strong>refer to</strong>. Follows references forward from the
              matched resources.
            </p>
          </div>
          <div className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-brand-teal/20 dark:border-brand-teal/15 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-teal to-brand-teal-light" />
              <h4 className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
                _revinclude
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Includes resources that <strong>refer to</strong> the search
              results. Follows references backward from other resources.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection id="include-revinclude-detail" title="Detailed _include / _revinclude" level={2}>
        <p>
          The syntax for{" "}
          <InlineCode>_include</InlineCode> /{" "}
          <InlineCode>_revinclude</InlineCode> is:
        </p>
        <CodeBlock
          language="text"
          title="Include Syntax"
          code={`_include=[source resource type]:[search parameter]:[target type]
_revinclude=[source resource type]:[search parameter]:[target type]`}
        />
        <CodeBlock
          language="bash"
          title="_include Examples"
          code={`# Include the Patient referenced by each Observation
GET /Observation?_include=Observation:subject:Patient

# Include all referenced resources (wildcard)
GET /Observation?_include=Observation:*

# Include the Practitioner who performed the Observation
GET /Observation?_include=Observation:performer:Practitioner`}
        />
        <CodeBlock
          language="bash"
          title="_revinclude Examples"
          code={`# Search Patients and include Observations that reference them
GET /Patient?_revinclude=Observation:subject

# Search MedicationRequests and include associated Provenance
GET /MedicationRequest?_revinclude=Provenance:target`}
        />

        <div className="my-6 rounded-xl border-2 border-brand-purple/15 dark:border-brand-purple/10 overflow-hidden bg-white/50 dark:bg-black/20">
          <div className="px-4 py-3 bg-brand-purple/5 dark:bg-brand-purple/10 border-b border-brand-purple/10">
            <h4 className="text-sm font-semibold text-brand-purple dark:text-brand-purple-light font-[family-name:var(--font-poppins)]">
              _include &amp; _revinclude Data Flow
            </h4>
          </div>
          <div className="p-2">
            <FlowDiagram type="include" />
          </div>
        </div>

        <Callout type="info" title="Bundle Entry Modes">
          Included resources appear in the Bundle with{" "}
          <InlineCode>search.mode = &quot;include&quot;</InlineCode> rather than{" "}
          <InlineCode>&quot;match&quot;</InlineCode>. This helps clients distinguish
          primary matches from included resources.
        </Callout>
      </DocSection>

      <DocSection id="iterate-modifier" title="The :iterate Modifier" level={2}>
        <p>
          By default, <InlineCode>_include</InlineCode> only follows one level
          of references. The <InlineCode>:iterate</InlineCode> modifier tells
          the server to recursively follow references, including resources that
          are referenced by included resources.
        </p>
        <CodeBlock
          language="bash"
          title=":iterate Examples"
          code={`# Include Patients, then include the Organization referenced by each Patient
GET /Observation?_include=Observation:subject:Patient&_include:iterate=Patient:organization

# Multi-level: Include QuestionnaireResponse answers and their nested references
GET /QuestionnaireResponse?_include:iterate=QuestionnaireResponse:*`}
        />

        <div className="my-6 rounded-xl border-2 border-brand-teal/15 dark:border-brand-teal/10 overflow-hidden bg-white/50 dark:bg-black/20">
          <div className="px-4 py-3 bg-brand-teal/5 dark:bg-brand-teal/10 border-b border-brand-teal/10">
            <h4 className="text-sm font-semibold text-brand-teal dark:text-brand-teal-light font-[family-name:var(--font-poppins)]">
              :iterate Modifier Chain
            </h4>
          </div>
          <div className="p-2">
            <FlowDiagram type="iterate" />
          </div>
        </div>

        <Callout type="warning" title="Circular References">
          Servers impose recursion limits to prevent infinite loops. Typically
          iteration is limited to 3-4 levels deep.
        </Callout>
      </DocSection>

      <DocSection id="graphql-vs-include" title="GraphQL vs _include" level={2}>
        <p>
          FHIR also supports GraphQL as an alternative to{" "}
          <InlineCode>_include</InlineCode> for fetching related resources.
          Here&apos;s a comparison:
        </p>
        <div className="my-4 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 dark:bg-white/[0.03]">
                <th className="text-left px-4 py-2 font-semibold w-40">Feature</th>
                <th className="text-left px-4 py-2 font-semibold">_include</th>
                <th className="text-left px-4 py-2 font-semibold">GraphQL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                [
                  "Field selection",
                  "Returns full resources",
                  "Returns only requested fields",
                ],
                [
                  "Nested references",
                  "Needs :iterate modifier",
                  "Natural nested syntax",
                ],
                [
                  "Server support",
                  "Widely supported",
                  "Less common, optional",
                ],
                [
                  "Pagination",
                  "Standard _count/_offset",
                  "Custom cursor-based",
                ],
                [
                  "Mutations",
                  "Not applicable",
                  "Supports create/update/delete",
                ],
              ].map(([feature, inc, gql]) => (
                <tr key={feature}>
                  <td className="px-4 py-2 font-medium">{feature}</td>
                  <td className="px-4 py-2 text-muted-foreground">{inc}</td>
                  <td className="px-4 py-2 text-muted-foreground">{gql}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>
    </>
  );
}
