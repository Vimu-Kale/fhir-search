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

export function FilterParameterSection() {
  return (
    <>
      <DocSection id="filter-parameter" title="The _filter Parameter" level={1}>
        <p>
          The <InlineCode>_filter</InlineCode> parameter provides a more
          expressive syntax for complex queries than the standard search URL
          parameters. It allows logical operations, grouping, and complex
          comparisons in a single parameter.
        </p>

        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: "Simple Expression",
              syntax: "parameter op value",
              example: "name eq john",
              color: "purple" as const,
            },
            {
              title: "Logical Operators",
              syntax: "expr and|or expr",
              example: "name eq john and birthdate gt 1990",
              color: "teal" as const,
            },
            {
              title: "Grouping",
              syntax: "(expr) and (expr)",
              example: "(name eq john) or (name eq jane)",
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
              <h4 className="font-semibold text-xs text-foreground font-[family-name:var(--font-poppins)]">
                {item.title}
              </h4>
              <div className="text-[11px] bg-brand-purple/5 dark:bg-brand-purple/10 rounded-lg px-3 py-2 font-mono text-brand-purple dark:text-brand-purple-light">
                {item.syntax}
              </div>
              <div className="text-[10px] text-muted-foreground">
                e.g. {item.example}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="filter-syntax" title="Filter Syntax" level={2}>
        <p>
          The grammar for the <InlineCode>_filter</InlineCode> parameter is:
        </p>
        <CodeBlock
          language="text"
          title="Filter Grammar"
          code={`filter        = paramExp / logExp / ( filter )
paramExp      = paramPath SP compareOp SP compValue
logExp        = filter SP ( "and" / "or" ) SP filter
paramPath     = paramName (( "." paramName ) / ( ":" modifierName ))
compareOp     = "eq" / "ne" / "co" / "sw" / "ew" / "gt" / "lt" / "ge" / "le" / "sa" / "eb" / "ap"
compValue     = token / QuotedString`}
        />

        <div className="my-4 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 dark:bg-white/[0.03]">
                <th className="text-left px-4 py-2 font-semibold w-16">Op</th>
                <th className="text-left px-4 py-2 font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["eq", "Equal"],
                ["ne", "Not equal"],
                ["co", "Contains (string)"],
                ["sw", "Starts with"],
                ["ew", "Ends with"],
                ["gt", "Greater than"],
                ["lt", "Less than"],
                ["ge", "Greater or equal"],
                ["le", "Less or equal"],
                ["sa", "Starts after (for ranges)"],
                ["eb", "Ends before (for ranges)"],
                ["ap", "Approximately equal"],
              ].map(([op, desc]) => (
                <tr key={op}>
                  <td className="px-4 py-2">
                    <InlineCode>{op}</InlineCode>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="filter-examples" title="Filter Examples" level={2}>
        <CodeBlock
          language="bash"
          title="Simple Filter"
          code={`GET /Patient?_filter=name eq "peter"`}
        />
        <CodeBlock
          language="bash"
          title="Logical AND"
          code={`GET /Patient?_filter=given eq "peter" and birthdate ge 1990-01-01`}
        />
        <CodeBlock
          language="bash"
          title="Logical OR with Grouping"
          code={`GET /Patient?_filter=(given eq "peter") or (given eq "john")`}
        />
        <CodeBlock
          language="bash"
          title="Nested Filters with Modifiers"
          code={`GET /Observation?_filter=code:text co "blood pressure" and date ge 2023-01-01`}
        />
      </DocSection>

      <DocSection id="filter-advanced" title="Advanced Filter Patterns" level={2}>
        <Callout type="info" title="Combining with Other Parameters">
          <InlineCode>_filter</InlineCode> can be combined with other search
          parameters like <InlineCode>_include</InlineCode>,{" "}
          <InlineCode>_sort</InlineCode>, and{" "}
          <InlineCode>_count</InlineCode>. However, not all servers support{" "}
          <InlineCode>_filter</InlineCode> — check the
          server&apos;s CapabilityStatement before use.
        </Callout>
        <CodeBlock
          language="bash"
          title="Complex Composed Filter"
          code={`GET /Observation?_filter=(code eq http://loinc.org|1234-5 or code eq http://loinc.org|6789-0) and date ge 2023-01-01&_sort=-date&_count=50`}
        />
      </DocSection>
    </>
  );
}
