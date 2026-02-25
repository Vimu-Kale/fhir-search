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

export function GraphQLSection() {
  return (
    <>
      <DocSection id="graphql" title="Using GraphQL with FHIR" level={1}>
        <p>
          FHIR supports GraphQL as an alternative to the REST search API. GraphQL
          provides fine-grained control over the data returned, reducing over-fetching
          and enabling complex queries in a single request.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6">
          {[
            {
              title: "Precise Fields",
              desc: "Request exactly the fields you need — no more, no less",
              color: "purple" as const,
            },
            {
              title: "Nested Traversal",
              desc: "Follow references naturally with nested syntax",
              color: "teal" as const,
            },
            {
              title: "Single Request",
              desc: "Fetch complex resource graphs in one call",
              color: "purple" as const,
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border rounded-xl p-4 space-y-2 ${
                item.color === "purple"
                  ? "border-brand-purple/20 dark:border-brand-purple/15"
                  : "border-brand-teal/20 dark:border-brand-teal/15"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.color === "purple"
                      ? "bg-brand-purple"
                      : "bg-brand-teal"
                  }`}
                />
                <h4 className="font-semibold text-xs">{item.title}</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="graphql-overview" title="GraphQL Overview" level={2}>
        <p>
          FHIR&apos;s GraphQL endpoint lets you query resources using the
          GraphQL query language. The schema is auto-generated from FHIR
          resource definitions, so every resource type and search parameter
          becomes part of the GraphQL schema.
        </p>
        <CodeBlock
          language="graphql"
          title="Basic GraphQL Query"
          code={`{
  Patient(id: "123") {
    id
    name {
      given
      family
    }
    birthDate
    gender
  }
}`}
        />
      </DocSection>

      <DocSection id="invoking-graphql" title="Invoking GraphQL" level={2}>
        <p>
          GraphQL is invoked by issuing a <InlineCode>POST</InlineCode> to the
          FHIR endpoint with a{" "}
          <InlineCode>Content-Type: application/graphql</InlineCode> or by
          sending the query in a JSON body:
        </p>
        <CodeBlock
          language="bash"
          title="GraphQL POST Request"
          code={`# Direct GraphQL query
POST /Patient/123/$graphql
Content-Type: application/graphql

{ name { given family } birthDate }

# Or via JSON body
POST /$graphql
Content-Type: application/json

{
  "query": "{ PatientList(name: \\"Smith\\") { id name { given family } } }"
}`}
        />
        <Callout type="info" title="Endpoints">
          GraphQL can be invoked at three levels:
          <ul className="list-disc ml-4 mt-2 space-y-1 text-sm">
            <li>
              <strong>Instance level:</strong>{" "}
              <InlineCode>[base]/[Type]/[id]/$graphql</InlineCode>
            </li>
            <li>
              <strong>Type level:</strong>{" "}
              <InlineCode>[base]/[Type]/$graphql</InlineCode>
            </li>
            <li>
              <strong>System level:</strong>{" "}
              <InlineCode>[base]/$graphql</InlineCode>
            </li>
          </ul>
        </Callout>
      </DocSection>

      <DocSection id="field-selection" title="Field Selection & Nesting" level={2}>
        <p>
          One of GraphQL&apos;s biggest advantages is selecting exactly which
          fields to return. You can also follow references by nesting:
        </p>
        <CodeBlock
          language="graphql"
          title="Nested Field Selection"
          code={`{
  ObservationList(code: "http://loinc.org|85354-9", _count: 10) {
    id
    status
    code {
      coding {
        system
        code
        display
      }
    }
    subject {
      resource {
        ... on Patient {
          id
          name { given family }
        }
      }
    }
    valueQuantity {
      value
      unit
    }
  }
}`}
        />

        <div className="my-6 rounded-xl border-2 border-brand-purple/15 dark:border-brand-purple/10 overflow-hidden bg-white/50 dark:bg-black/20">
          <div className="px-4 py-3 bg-brand-purple/5 dark:bg-brand-purple/10 border-b border-brand-purple/10">
            <h4 className="text-sm font-semibold text-brand-purple dark:text-brand-purple-light font-[family-name:var(--font-poppins)]">
              GraphQL Query Flow
            </h4>
          </div>
          <div className="p-2">
            <FlowDiagram type="graphql" />
          </div>
        </div>
      </DocSection>

      <DocSection id="mutations" title="GraphQL Mutations" level={2}>
        <p>
          In addition to querying, FHIR GraphQL supports mutations for
          creating, updating, patching, and deleting resources.
        </p>

        <div className="my-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { op: "Create", verb: "POST", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
            { op: "Update", verb: "PUT", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
            { op: "Patch", verb: "PATCH", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
            { op: "Delete", verb: "DELETE", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
          ].map(({ op, verb, color }) => (
            <div
              key={op}
              className={`border rounded-xl p-3 text-center ${color}`}
            >
              <div className="font-bold text-sm">{op}</div>
              <div className="text-[10px] font-mono mt-1">{verb}</div>
            </div>
          ))}
        </div>

        <CodeBlock
          language="graphql"
          title="Create Mutation"
          code={`mutation {
  PatientCreate(res: {
    resourceType: "Patient"
    name: [{ given: ["John"], family: "Doe" }]
    birthDate: "1990-01-01"
    gender: "male"
  }) {
    id
    name { given family }
  }
}`}
        />

        <CodeBlock
          language="graphql"
          title="Update Mutation"
          code={`mutation {
  PatientUpdate(id: "123", res: {
    resourceType: "Patient"
    id: "123"
    name: [{ given: ["John", "Michael"], family: "Doe" }]
    birthDate: "1990-01-01"
    gender: "male"
  }) {
    id
    name { given family }
  }
}`}
        />

        <CodeBlock
          language="graphql"
          title="Patch Mutation (JSON Patch)"
          code={`mutation {
  PatientPatch(id: "123", patches: [
    { op: "replace", path: "/birthDate", value: "1990-06-15" }
    { op: "add", path: "/telecom/-", value: {
      system: "phone", value: "555-0123", use: "mobile"
    }}
  ]) {
    id
    birthDate
    telecom { system value use }
  }
}`}
        />

        <CodeBlock
          language="graphql"
          title="Delete Mutation"
          code={`mutation {
  PatientDelete(id: "123") {
    id
  }
}`}
        />
      </DocSection>

      <DocSection id="query-limits" title="GraphQL Query Limits" level={2}>
        <p>
          To guard against expensive or malicious queries, FHIR servers enforce
          limits on GraphQL query complexity. Understanding these limits helps
          you write efficient queries.
        </p>

        <div className="my-4 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 dark:bg-white/[0.03]">
                <th className="text-left px-4 py-2 font-semibold w-48">Limit</th>
                <th className="text-left px-4 py-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                [
                  "Max Depth",
                  "Maximum nesting depth of the query (typically 5-10 levels)",
                ],
                [
                  "Max Complexity",
                  "Total estimated cost of the query based on field weights",
                ],
                [
                  "Max Results",
                  "Maximum number of resources returned per list query",
                ],
                [
                  "Timeout",
                  "Maximum execution time before the query is aborted",
                ],
                [
                  "Rate Limiting",
                  "Maximum queries per time period per client",
                ],
              ].map(([limit, desc]) => (
                <tr key={limit}>
                  <td className="px-4 py-2 font-medium">{limit}</td>
                  <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout type="warning" title="Query Cost Estimation">
          Some servers use a point-based cost system. Example estimation:
          <ul className="list-disc ml-4 mt-2 space-y-1 text-sm">
            <li>Each scalar field: 1 point</li>
            <li>Each object field: 2 points</li>
            <li>
              Each list field: 2 points × <InlineCode>_count</InlineCode>
            </li>
            <li>
              Nested references: multiply parent cost × child cost
            </li>
          </ul>
          Typical max budget: 500-1,000 points per query.
        </Callout>

        <CodeBlock
          language="graphql"
          title="Efficient Query (Low Cost)"
          code={`{
  PatientList(_count: 10) {
    id
    name { family }
    birthDate
  }
}`}
        />

        <CodeBlock
          language="graphql"
          title="Expensive Query (High Cost)"
          code={`# ⚠ This query may exceed complexity limits!
{
  PatientList(_count: 100) {
    id
    name { given family }
    ObservationList(_reference: subject, _count: 50) {
      code { coding { system code display } }
      MedicationRequestList(_reference: subject, _count: 20) {
        medication { coding { display } }
      }
    }
  }
}`}
        />

        <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tip: "Limit _count", detail: "Use small page sizes (10-20) for nested lists" },
            { tip: "Reduce depth", detail: "Flatten queries where possible, avoid 4+ nested levels" },
            { tip: "Select fields", detail: "Request only the specific fields you need" },
          ].map(({ tip, detail }) => (
            <div
              key={tip}
              className="bg-brand-teal/5 dark:bg-brand-teal/[0.06] border border-brand-teal/20 dark:border-brand-teal/15 rounded-xl p-3"
            >
              <div className="text-xs font-bold text-brand-teal mb-1">{tip}</div>
              <div className="text-[11px] text-muted-foreground leading-snug">
                {detail}
              </div>
            </div>
          ))}
        </div>
      </DocSection>
    </>
  );
}
