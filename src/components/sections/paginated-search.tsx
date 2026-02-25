import { DocSection } from "@/components/doc-section";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";
import { Badge } from "@/components/ui/badge";

function InlineCode({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <code className="bg-brand-purple/10 dark:bg-brand-purple/15 text-brand-purple dark:text-brand-purple-light px-1.5 py-0.5 rounded-md text-[13px] font-mono font-medium">
      {children}
    </code>
  );
}

export function PaginatedSearchSection() {
  return (
    <>
      <DocSection id="paginated-search" title="Paginated Search" level={1}>
        <p>
          Pagination is a crucial feature in any API that deals with large
          datasets. When querying resources, it&apos;s often impractical or
          unnecessary to return all matching results in a single response.
          Pagination allows clients to retrieve results in manageable chunks,
          improving performance and reducing network load.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-border/50 dark:border-brand-purple/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-light" />
              <h4 className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
                Offset-based
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uses the <InlineCode>_offset</InlineCode> parameter to skip a
              specified number of results. Best for smaller datasets and
              jumping to specific pages.
            </p>
          </div>
          <div className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-border/50 dark:border-brand-purple/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-teal to-brand-teal-light" />
              <h4 className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
                Cursor-based
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uses the <InlineCode>_cursor</InlineCode> parameter with an
              opaque token. Ideal for large datasets and streaming through
              millions of resources.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection id="offset-pagination" title="Offset-based Pagination" level={2}>
        <p>
          Offset-based pagination uses the <InlineCode>_offset</InlineCode>{" "}
          parameter. This method is straightforward and allows clients to skip a
          specified number of results. The parameter accepts an integer value, where{" "}
          <InlineCode>_offset=0</InlineCode> returns the first page.
        </p>
        <CodeBlock
          language="bash"
          title="Offset Pagination Example"
          code={`GET /Patient?_offset=20`}
        />
        <p className="text-sm text-muted-foreground">
          This returns results starting from the 21st matching Patient resource.
        </p>
        <Callout type="warning" title="Limitations">
          Servers may support <InlineCode>_offset</InlineCode> values only up
          to 10,000. Offset-based pagination translates to a SQL{" "}
          <InlineCode>LIMIT</InlineCode> clause — while efficient for smaller
          offsets, it can cause performance issues for very large offsets.
        </Callout>
        <p className="text-sm font-medium mt-4">When to Use:</p>
        <ul className="list-none space-y-2 my-3">
          {["Smaller datasets", "Jumping to a specific page number", "When total number of results is important"].map(
            (item, i) => (
              <li
                key={`offset-${item}`}
                className="flex items-start gap-3 bg-muted/30 dark:bg-white/[0.03] rounded-xl px-4 py-2.5"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-lg bg-brand-purple/10 text-brand-purple text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm">{item}</span>
              </li>
            )
          )}
        </ul>
      </DocSection>

      <DocSection id="cursor-pagination" title="Cursor-based Pagination" level={2}>
        <p>
          Cursor-based pagination uses the <InlineCode>_cursor</InlineCode>{" "}
          parameter—an opaque string value representing a pointer to a specific
          item in the result set. The initial request doesn&apos;t include a{" "}
          <InlineCode>_cursor</InlineCode>; subsequent requests use the value
          from <InlineCode>Bundle.link</InlineCode> with{" "}
          <InlineCode>relation=&quot;next&quot;</InlineCode>.
        </p>
        <CodeBlock
          language="bash"
          title="Cursor Pagination Example"
          code={`GET /Patient?_cursor=abc123xyz`}
        />
        <Callout type="info" title="Requirements">
          Cursor-based pagination currently only supports searches sorted on{" "}
          <InlineCode>_lastUpdated</InlineCode> in ascending order, and
          requires a minimum <InlineCode>_count</InlineCode> value of 20. The
          cursor values are opaque and should be treated as black boxes by
          clients.
        </Callout>
        <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Scale", desc: "Millions of resources" },
            { label: "Performance", desc: "Uses database indexes" },
            { label: "Consistency", desc: "Stable across data changes" },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="bg-brand-teal/5 dark:bg-brand-teal/[0.06] border border-brand-teal/20 dark:border-brand-teal/15 rounded-xl p-3 text-center"
            >
              <div className="text-xs font-bold text-brand-teal">{label}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{desc}</div>
            </div>
          ))}
        </div>
        <CodeBlock
          language="bash"
          title="Cursor with Other Filters"
          code={`GET /Observation?code=xyz&_sort=_lastUpdated&_cursor=abc123xyz`}
        />
      </DocSection>

      <DocSection id="page-size-count" title="Setting Page Size with _count" level={2}>
        <p>
          Use the <InlineCode>_count</InlineCode> query parameter to set the
          number of items returned per page. The default page size is typically
          20, with a maximum of 1,000.
        </p>
        <CodeBlock
          language="bash"
          title="Page Size Example"
          code={`GET /Patient?_count=50`}
        />
        <Callout type="warning" title="Paginating with Included Resources">
          Pagination can be difficult when using{" "}
          <InlineCode>_include</InlineCode> as you won&apos;t know how many of
          each resource will be returned. Consider using chained searches
          instead so only resources of one type are returned.
        </Callout>
      </DocSection>

      <DocSection id="total-results" title="Total Results with _total" level={2}>
        <p>
          Use the <InlineCode>_total</InlineCode> parameter to include the
          total count of matching resources in the response:
        </p>
        <div className="my-4 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 dark:bg-white/[0.03]">
                <th className="text-left px-4 py-2 font-semibold w-32">Value</th>
                <th className="text-left px-4 py-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["none", "No total is returned (default)"],
                ["estimate", "Approximate count — faster, uses database statistics"],
                ["accurate", "Exact count — may be slower for large datasets"],
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
        <Callout type="warning" title="Expensive Operation">
          Because computing counts is expensive, servers may only produce
          estimated counts above a certain threshold (e.g., 1 million entries).
          Even if <InlineCode>_total=accurate</InlineCode> is specified, the
          estimated count may be returned if the dataset exceeds the threshold.
        </Callout>
      </DocSection>

      <DocSection id="sort-pagination" title="Always Sort When Paginating" level={2}>
        <p>
          When paginating through search results, it is <strong>essential</strong>{" "}
          to sort the results to ensure consistent output across pages. If you
          don&apos;t sort, you may see different resources on each page, leading
          to unexpected behavior.
        </p>
        <CodeBlock
          language="bash"
          title="Sorted Pagination"
          code={`GET /Patient?_sort=_lastUpdated&_count=50&_offset=100`}
        />
      </DocSection>
    </>
  );
}
