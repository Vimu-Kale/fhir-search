import { DocSection } from "@/components/doc-section";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";

function InlineCode({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <code className="bg-brand-purple/10 dark:bg-brand-purple/15 text-brand-purple dark:text-brand-purple-light px-1.5 py-0.5 rounded-md text-[13px] font-mono font-medium">
      {children}
    </code>
  );
}

export function AdvancedParamsSection() {
  return (
    <>
      <DocSection id="advanced-params" title="Advanced Search Parameters" level={1}>
        <p>
          FHIR servers support a set of parameters that apply to all resources.
          These &quot;common&quot; parameters let you narrow results by resource identity,
          last modification time, profile membership, and more.
        </p>
      </DocSection>

      <DocSection id="param-id" title="_id Parameter" level={2}>
        <p>
          The <InlineCode>_id</InlineCode> parameter searches by the logical ID
          of the resource. Every resource on the server has a unique ID, making
          this efficient for targeted lookups.
        </p>
        <CodeBlock
          language="bash"
          title="_id Examples"
          code={`# Find one patient by ID
GET /Patient?_id=123

# Find multiple patients by ID
GET /Patient?_id=123,456,789`}
        />
      </DocSection>

      <DocSection id="param-last-updated" title="_lastUpdated Parameter" level={2}>
        <p>
          The <InlineCode>_lastUpdated</InlineCode> parameter filters resources
          by the last time they were changed on the server. It accepts prefixes
          such as <InlineCode>gt</InlineCode>, <InlineCode>lt</InlineCode>,{" "}
          <InlineCode>ge</InlineCode>, <InlineCode>le</InlineCode>.
        </p>
        <CodeBlock
          language="bash"
          title="_lastUpdated Examples"
          code={`# Resources updated after a date
GET /Patient?_lastUpdated=gt2023-01-01

# Resources updated in a date range
GET /Patient?_lastUpdated=gt2023-01-01&_lastUpdated=lt2023-12-31`}
        />
        <Callout type="info" title="Timezone Handling">
          If no timezone is specified, the server&apos;s default timezone is
          used. Always provide an explicit timezone in production (e.g.,{" "}
          <InlineCode>2023-01-01T00:00:00Z</InlineCode>).
        </Callout>
      </DocSection>

      <DocSection id="param-summary" title="_summary Parameter" level={2}>
        <p>
          The <InlineCode>_summary</InlineCode> parameter requests the server to
          return a summarized version of resources, reducing payload size:
        </p>
        <div className="my-4 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 dark:bg-white/[0.03]">
                <th className="text-left px-4 py-2 font-semibold w-36">Value</th>
                <th className="text-left px-4 py-2 font-semibold">Returns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["true", "Only elements marked as summary in StructureDefinition"],
                ["text", "Only the text, id, meta, and top-level mandatory elements"],
                ["data", "All elements except the text"],
                ["count", "Only the count of matching resources (no resource data)"],
                ["false", "All parts of the resource (default)"],
              ].map(([val, desc]) => (
                <tr key={val}>
                  <td className="px-4 py-2">
                    <InlineCode>{val}</InlineCode>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="bash"
          title="_summary Example"
          code={`GET /Patient?_summary=true`}
        />
      </DocSection>

      <DocSection id="param-elements" title="_elements Parameter" level={2}>
        <p>
          The <InlineCode>_elements</InlineCode> parameter requests the server to
          return only specific elements of each resource — a finer-grained
          alternative to <InlineCode>_summary</InlineCode>.
        </p>
        <CodeBlock
          language="bash"
          title="_elements Example"
          code={`# Only return name and birth date
GET /Patient?_elements=name,birthDate`}
        />
        <Callout type="info" title="Mandatory Elements">
          Even with <InlineCode>_elements</InlineCode>, the server always
          includes mandatory elements (e.g., <InlineCode>id</InlineCode>,{" "}
          <InlineCode>meta</InlineCode>) plus elements required by the resource
          definition.
        </Callout>
      </DocSection>

      <DocSection id="param-tag" title="_tag Parameter" level={2}>
        <p>
          The <InlineCode>_tag</InlineCode> parameter filters resources by tags
          in <InlineCode>meta.tag</InlineCode>. Tags are coded values drawn from
          a vocabulary.
        </p>
        <CodeBlock
          language="bash"
          title="_tag Example"
          code={`GET /Patient?_tag=http://example.org/codes|needs-review`}
        />
      </DocSection>

      <DocSection id="param-compartment" title="Compartment Searches" level={2}>
        <p>
          A compartment is a logical grouping of resources associated with an
          entity. For example, a Patient compartment includes all
          resources related to that patient such as observations, conditions,
          medications, etc.
        </p>
        <CodeBlock
          language="bash"
          title="Compartment Search Examples"
          code={`# All Observations for Patient 123
GET /Patient/123/Observation

# All Conditions for Patient 123
GET /Patient/123/Condition`}
        />
        <Callout type="info" title="Server Conformance">
          Not all servers support compartment searches. Check the
          server&apos;s CapabilityStatement to determine compartment support.
        </Callout>
      </DocSection>

      <DocSection id="param-profile" title="_profile Parameter" level={2}>
        <p>
          The <InlineCode>_profile</InlineCode> parameter searches for resources
          that conform to a specific FHIR profile (in{" "}
          <InlineCode>meta.profile</InlineCode>).
        </p>
        <CodeBlock
          language="bash"
          title="_profile Example"
          code={`GET /Patient?_profile=http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient`}
        />
      </DocSection>

      <DocSection id="param-security" title="_security Parameter" level={2}>
        <p>
          The <InlineCode>_security</InlineCode> parameter searches resources
          based on security labels in <InlineCode>meta.security</InlineCode>.
        </p>
        <CodeBlock
          language="bash"
          title="_security Example"
          code={`GET /Patient?_security=http://terminology.hl7.org/CodeSystem/v3-Confidentiality|R`}
        />
      </DocSection>

      <DocSection id="param-source" title="_source Parameter" level={2}>
        <p>
          The <InlineCode>_source</InlineCode> parameter filters resources
          based on the <InlineCode>meta.source</InlineCode> URI, which
          identifies the originating system or application.
        </p>
        <CodeBlock
          language="bash"
          title="_source Example"
          code={`GET /Patient?_source=http://hospital.example.org/ehr`}
        />
      </DocSection>
    </>
  );
}
