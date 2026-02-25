import { DocSidebar } from "@/components/doc-sidebar";
import { DocSection } from "@/components/doc-section";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  ExternalLink,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import { PaginatedSearchSection } from "@/components/sections/paginated-search";
import { AdvancedParamsSection } from "@/components/sections/advanced-params";
import { FilterParameterSection } from "@/components/sections/filter-parameter";
import { ChainingSection } from "@/components/sections/chaining-section";
import { IncludingResourcesSection } from "@/components/sections/including-resources";
import { GraphQLSection } from "@/components/sections/graphql-section";

export default function FHIRSearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <DocSidebar />

      {/* Main content */}
      <main className="pl-14 transition-all duration-300">
        {/* Hero header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#1A0F2C] via-[#2D1A4A] to-[#1A0F2C]">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-purple/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-brand-teal/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-purple/5 blur-3xl" />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto px-8 py-16 lg:py-24">
            <div className="flex items-center gap-3 mb-6">
              <Badge
                variant="outline"
                className="border-brand-teal/40 text-brand-teal-light bg-brand-teal/10 rounded-full px-3 py-1 text-xs"
              >
                Normative
              </Badge>
              <Badge
                variant="outline"
                className="border-brand-purple/40 text-brand-purple-light bg-brand-purple/10 rounded-full px-3 py-1 text-xs"
              >
                v3.2.1
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-poppins)] leading-tight">
              FHIR Search
            </h1>
            <p className="text-lg text-white/60 max-w-2xl leading-relaxed font-[family-name:var(--font-inter)]">
              The primary mechanism to find and list resource instances in HL7
              FHIR. Search operations traverse existing resources, filtering by
              parameters supplied to the search operation.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#introduction"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-light text-white rounded-xl text-sm font-medium transition-colors"
              >
                <BookOpen size={16} />
                Read Documentation
              </a>
              <a
                href="http://hl7.org/fhir"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
              >
                HL7 FHIR Spec
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 mt-10 text-xs text-white/30">
              <span>Exchange</span>
              <ArrowRight size={10} />
              <span>RESTful API</span>
              <ArrowRight size={10} />
              <span className="text-brand-teal-light">Search</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* ───────────── INTRODUCTION ───────────── */}
          <DocSection id="introduction" title="Introduction" level={1}>
            <p>
              FHIR Search is the primary mechanism used to find and list resource
              instances. The search mechanism is designed to be flexible enough to
              meet the needs of a wide variety of use cases, and yet be simple
              enough to be commonly useful.
            </p>
            <p>
              In a typical RESTful interface, collections of instances are returned
              as arrays of a type. In order to include related information (e.g.,
              number of total results), support extended functionality (e.g.,
              paging), and allow multiple resource types in results (e.g.,
              returning Patient and Encounter resources), FHIR Search instead
              returns a <InlineCode>Bundle</InlineCode> resource, with a type of{" "}
              <InlineCode>searchset</InlineCode>.
            </p>
            <Callout type="warning" title="Safety Notice">
              There are safety issues associated with the implementation of
              searching that implementers need to always keep in mind. Implementers
              SHOULD review the safety checklist.
            </Callout>
          </DocSection>

          <DocSection id="url-encoding" title="Notes on URL-Encoding" level={2}>
            <p>
              Syntaxes and examples are shown <em>without</em> URL-Encoding
              escaping applied. For example, a syntax of{" "}
              <InlineCode>[url]|[version]</InlineCode> will be URL encoded during
              transmission as <InlineCode>[url]%7C[version]</InlineCode>.
            </p>
            <p>
              Clients and servers SHOULD be robust in their handling of URLs
              present in the content of FHIR bundles, such as in{" "}
              <InlineCode>Bundle.link.url</InlineCode>.
            </p>
            <p>For example, the following unencoded request:</p>
            <CodeBlock
              language="bash"
              title="Unencoded HTTP GET"
              code={`GET [base]/Observation?patient.identifier=http://example.com/fhir/identifier/mrn|123456`}
            />
            <p>Would actually be transmitted over-the-wire as:</p>
            <CodeBlock
              language="bash"
              title="Encoded HTTP GET"
              code={`GET [base]/Observation?patient.identifier=http%3A%2F%2Fexample.com%2Ffhir%2Fidentifier%2Fmrn%7C123456`}
            />
          </DocSection>

          <DocSection id="search-overview" title="Search Overview" level={2}>
            <p>
              Though search operations are typically performed via REST, search is
              defined to be useful independently of HTTP. Note that while different
              formats of search requests are functionally equivalent, implementation
              considerations can result in differences inherent to searching via a
              particular protocol.
            </p>
          </DocSection>

          <DocSection id="search-inputs" title="Search Inputs" level={2}>
            <p>
              Input to search operations are referred to as{" "}
              <strong>Search Parameters</strong>. A search parameter can be:
            </p>
            <ul className="list-none space-y-2 my-4">
              <li className="flex items-start gap-3 bg-muted/50 dark:bg-white/[0.04] rounded-xl px-4 py-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-brand-purple shrink-0" />
                <span>
                  A filter across <strong>all resources</strong> (e.g.,{" "}
                  <InlineCode>_id</InlineCode>, which is present on every
                  resource)
                </span>
              </li>
              <li className="flex items-start gap-3 bg-muted/50 dark:bg-white/[0.04] rounded-xl px-4 py-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-brand-teal shrink-0" />
                <span>
                  A filter on a <strong>specific resource</strong> (e.g.,{" "}
                  <InlineCode>Patient.birthDate</InlineCode>)
                </span>
              </li>
              <li className="flex items-start gap-3 bg-muted/50 dark:bg-white/[0.04] rounded-xl px-4 py-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-brand-purple-light shrink-0" />
                <span>
                  A <strong>textual search</strong> across a resource
                </span>
              </li>
              <li className="flex items-start gap-3 bg-muted/50 dark:bg-white/[0.04] rounded-xl px-4 py-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-brand-teal-light shrink-0" />
                <span>
                  A parameter that <strong>affects search results</strong>
                </span>
              </li>
            </ul>
            <Callout type="info" title="Case Sensitivity">
              Search parameter names are case sensitive, though this specification
              never defines different parameters with names that differ only in
              case. Clients SHOULD use correct case, and servers SHALL NOT define
              additional parameters with different meanings with names that only
              differ in case.
            </Callout>
            <p>
              Order of operations is not driven by order in the URL — with the
              exception of sort. First all filters are applied, then the result set
              is sorted, then paging is applied, and then included resources (
              <InlineCode>_include</InlineCode>,{" "}
              <InlineCode>_revinclude</InlineCode>) are added for each page.
            </p>
          </DocSection>

          <DocSection id="search-contexts" title="Search Contexts" level={2}>
            <p>
              Search operations are executed in one of three defined contexts that
              control which set of resources are being searched:
            </p>

            <div className="space-y-4 my-6">
              <ContextCard
                title="All resource types"
                badge="System-level"
                description="If the _type parameter is included, all other search parameters SHALL be common to all provided types."
                code="GET [base]?parameter(s)"
              />
              <ContextCard
                title="A specified resource type"
                badge="Type-level"
                description="Search is limited to resources of a specific type."
                code="GET [base]/[type]?parameter(s)"
              />
              <ContextCard
                title="A specified compartment"
                badge="Compartment"
                description="Search within a compartment, perhaps with a specified resource type. The literal * (asterisk) is valid as the [type]."
                code="GET [base]/[compartment]/[id]/[type]?parameter(s)"
              />
            </div>
          </DocSection>

          <Separator className="my-12" />

          {/* ───────────── SEARCH RESPONSES ───────────── */}
          <DocSection id="search-responses" title="Search Responses" level={1}>
            <p>
              Search responses are always returned as a{" "}
              <InlineCode>Bundle</InlineCode>. Search result bundles convey a lot
              of metadata in addition to any possible results, using the various
              elements available in the bundle resource.
            </p>
          </DocSection>

          <DocSection id="bundle-type" title="Bundle Type" level={2}>
            <p>
              Search result bundles will always have the{" "}
              <InlineCode>Bundle.type</InlineCode> of{" "}
              <InlineCode>searchset</InlineCode>. The{" "}
              <InlineCode>Bundle.type</InlineCode> value of{" "}
              <InlineCode>searchset</InlineCode> designates that a bundle is a
              search response and may be used in processing to classify bundles.
            </p>
          </DocSection>

          <DocSection id="self-link" title="Self Link — Understanding a Performed Search" level={2}>
            <p>
              In order to allow the client to be confident about what search
              parameters were used as criteria by a server, servers SHALL return
              the parameters that were actually used to process a search.
              Applications processing search results SHALL check these returned
              values where necessary.
            </p>
            <CodeBlock
              language="json"
              title="Self Link Example (FHIR+JSON)"
              code={`{
  "resourceType": "Bundle",
  "type": "searchset",
  "link": {
    "relation": "self",
    "url": "http://example.org/Patient?name=peter"
  }
}`}
            />
            <Callout type="info">
              Self links SHALL be expressed as an HTTP GET-based search with the
              relevant parameters included as query parameters. Clients SHALL
              review the returned parameters in the self link to ensure proper
              processing of results.
            </Callout>
          </DocSection>

          <DocSection id="paging" title="Other Links — Paging" level={2}>
            <p>
              In addition to the self link, many bundles may contain links relevant
              to paging. These are identified via the{" "}
              <InlineCode>relation</InlineCode> value in the links. Common links
              include: <InlineCode>first</InlineCode>,{" "}
              <InlineCode>last</InlineCode>, <InlineCode>next</InlineCode>,{" "}
              <InlineCode>prev</InlineCode>, and{" "}
              <InlineCode>previous</InlineCode>.
            </p>
            <Callout type="info">
              Note that <InlineCode>prev</InlineCode> and{" "}
              <InlineCode>previous</InlineCode> are widely-used synonyms and are
              interchangeable.
            </Callout>
          </DocSection>

          <DocSection id="matches-inclusions-outcomes" title="Matches, Inclusions, and Outcomes" level={2}>
            <p>
              Within the results bundle, there are three types of entries that may
              be present, identified by the <InlineCode>search mode</InlineCode>{" "}
              of the entry:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <ModeCard
                title="Match"
                color="purple"
                description="A record is being returned because it meets the parameters specified in the search request."
              />
              <ModeCard
                title="Include"
                color="teal"
                description="A record is being returned because it is referred to from a record in the result set."
              />
              <ModeCard
                title="Outcome"
                color="neutral"
                description="OperationOutcome resources with information related to the processing of a search."
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Entries are unique (not allowed to repeat) and there is only
              one mode per entry. If a resource is both a match and an include,{" "}
              <strong>match</strong> takes precedence.
            </p>
          </DocSection>

          <DocSection id="handling-errors" title="Handling Errors" level={2}>
            <p>
              If a server is unable to execute a search request, it MAY either
              return an error for the request or return success with an outcome
              containing details of the error. A HTTP status code of{" "}
              <InlineCode>403</InlineCode> signifies that the server refused to
              perform the search.
            </p>

            <div className="my-6 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-white/[0.03]">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Issue
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Search
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <ErrorRow
                    issue="Non-existent resource by ID"
                    search="GET [base]/Observation?_id=101"
                  />
                  <ErrorRow
                    issue="Unknown patient identifier"
                    search="GET [base]/Observation?patient.identifier=http://example.com/fhir/mrn|1234"
                  />
                  <ErrorRow
                    issue="Unknown code"
                    search="GET [base]/Observation?code=loinc|1234-1"
                  />
                  <ErrorRow
                    issue="Out-of-scope time"
                    search="GET [base]/Condition?onset=le1900"
                  />
                  <ErrorRow
                    issue="Illegal or unsupported modifier"
                    search="GET [base]/Condition?onset:text=now"
                  />
                  <ErrorRow
                    issue="Incorrect date format"
                    search="GET [base]/Condition?onset=23.May.2020"
                  />
                  <ErrorRow
                    issue="Unknown parameter"
                    search="GET [base]/Condition?myInvalidParam=true"
                  />
                </tbody>
              </table>
            </div>

            <Callout type="warning" title="Unknown Parameters">
              Servers SHOULD ignore unknown or unsupported parameters. Clients can
              request specific server behavior by using the{" "}
              <InlineCode>Prefer</InlineCode> header:
            </Callout>
            <CodeBlock
              language="bash"
              title="Prefer Header Options"
              code={`Prefer: handling=strict   # Server returns an error for unknown params
Prefer: handling=lenient  # Server ignores unknown params`}
            />
          </DocSection>

          <Separator className="my-12" />

          {/* ───────────── TRANSPORT PROTOCOLS ───────────── */}
          <DocSection id="transport-protocols" title="Transport Protocols" level={1}>
            <p>
              This specification defines FHIR Search operations in both HTTP POST
              and GET. For details about the HTTP methods regarding search, please
              see the Search section of the HTTP page.
            </p>
          </DocSection>

          <DocSection id="multi-datastore" title="Multi-datastore Considerations" level={2}>
            <p>
              Some servers expose a FHIR endpoint that actually represents multiple
              data stores. For example, a system might expose a single{" "}
              <InlineCode>Observation</InlineCode> endpoint, even though internally
              there are distinct systems for labs, vitals, clinical assessments, and
              symptoms.
            </p>
            <p>Systems can handle such limitations in at least four ways:</p>
            <ol className="list-none space-y-3 my-4">
              {[
                "By requiring that some searches include certain mandatory criteria.",
                "By having the intermediary system perform supplementary filtering.",
                "By returning a warning message in the search OperationOutcome.",
                "By exposing distinct FHIR endpoints for each data source.",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-muted/30 dark:bg-white/[0.03] rounded-xl px-4 py-3"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-brand-purple to-brand-teal text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm">{text}</span>
                </li>
              ))}
            </ol>
          </DocSection>

          <DocSection id="batching-searches" title="Batching Search Requests" level={2}>
            <p>
              Servers MAY support batching multiple requests. In the context of
              search, this allows several searches to be performed serially via a
              single request. Note that each operation of a batch is independent,
              so it is not possible to use the results of one request as input to
              another in the same batch.
            </p>
          </DocSection>

          <Separator className="my-12" />

          {/* ───────────── SEARCH PARAMETERS ───────────── */}
          <DocSection id="search-parameters" title="Search Parameters" level={1}>
            <p>
              Search parameters define the set of criteria that can be used to
              filter or find resources. Each resource type may define specific
              search parameters, and there are common search parameters that apply
              to all resources.
            </p>
          </DocSection>

          <DocSection id="search-test-basics" title="Search Test Basics" level={2}>
            <p>
              When testing a search parameter against a resource, the server
              evaluates whether the resource contains a value that satisfies the
              parameter condition. The specific matching rules depend on the
              parameter type and any modifiers applied.
            </p>
          </DocSection>

          <DocSection id="matching-cardinality" title="Matching and Cardinality" level={2}>
            <p>
              For parameters that match elements with cardinality greater than one,
              a match occurs if any element in the collection satisfies the search
              condition. The search parameter effectively operates across all
              values in the collection using OR logic.
            </p>
          </DocSection>

          <DocSection id="multiple-values" title="Searching Multiple Values (AND / OR)" level={2}>
            <p>
              Parameters can have multiple values, which can be combined with AND
              or OR logic:
            </p>
            <CodeBlock
              language="bash"
              title="OR Logic (comma-separated)"
              code={`GET [base]/Patient?language=FR,NL`}
            />
            <p className="text-sm text-muted-foreground">
              Matches patients who speak French <strong>OR</strong> Dutch.
            </p>
            <CodeBlock
              language="bash"
              title="AND Logic (repeated parameter)"
              code={`GET [base]/Patient?language=FR&language=NL`}
            />
            <p className="text-sm text-muted-foreground">
              Matches patients who speak French <strong>AND</strong> Dutch.
            </p>
          </DocSection>

          <DocSection id="modifiers" title="Modifiers" level={2}>
            <p>
              Modifiers are appended to a parameter name using a colon, and change
              the behavior of how the parameter is matched. Common modifiers
              include:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              {[
                { mod: ":exact", desc: "Exact string match (case-sensitive)" },
                { mod: ":contains", desc: "Partial string match" },
                { mod: ":missing", desc: "Test for missing elements" },
                { mod: ":not", desc: "Negation modifier for token" },
                { mod: ":text", desc: "Text search on CodeableConcept" },
                { mod: ":above / :below", desc: "Code hierarchy search" },
              ].map(({ mod, desc }) => (
                <div
                  key={mod}
                  className="flex items-start gap-3 bg-muted/30 dark:bg-white/[0.03] border border-border/50 dark:border-brand-purple/10 rounded-xl px-4 py-3"
                >
                  <InlineCode>{mod}</InlineCode>
                  <span className="text-sm text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
            <CodeBlock
              language="bash"
              title="Modifier Example"
              code={`GET [base]/Patient?name:exact=John
GET [base]/Patient?name:contains=jon
GET [base]/Patient?email:missing=true`}
            />
          </DocSection>

          <DocSection id="prefixes" title="Prefixes" level={2}>
            <p>
              For ordered parameters (number, date, quantity), a prefix indicates
              how the value is to be interpreted in relation to the search value:
            </p>
            <div className="my-4 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-white/[0.03]">
                    <th className="text-left px-4 py-2 font-semibold">Prefix</th>
                    <th className="text-left px-4 py-2 font-semibold">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["eq", "Equal (default)"],
                    ["ne", "Not equal"],
                    ["gt", "Greater than"],
                    ["lt", "Less than"],
                    ["ge", "Greater or equal"],
                    ["le", "Less or equal"],
                    ["sa", "Starts after"],
                    ["eb", "Ends before"],
                    ["ap", "Approximately"],
                  ].map(([prefix, meaning]) => (
                    <tr key={prefix}>
                      <td className="px-4 py-2">
                        <InlineCode>{prefix}</InlineCode>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock
              language="bash"
              title="Prefix Examples"
              code={`GET [base]/Observation?date=ge2023-01-01
GET [base]/RiskAssessment?probability=gt0.8
GET [base]/Observation?value-quantity=le5.4|http://unitsofmeasure.org|mg`}
            />
          </DocSection>

          <DocSection id="escaping" title="Escaping Search Parameters" level={2}>
            <p>
              In the values of search parameters, the characters{" "}
              <InlineCode>$</InlineCode>, <InlineCode>,</InlineCode>, and{" "}
              <InlineCode>|</InlineCode> are used as delimiters. If a value
              includes one of these characters literally, it SHALL be prefixed by a{" "}
              <InlineCode>\</InlineCode> (backslash) character.
            </p>
            <CodeBlock
              language="bash"
              title="Escaping Example"
              code={`GET [base]/ValueSet?url=http://example.org/fhir/ValueSet/123\\|456`}
            />
          </DocSection>

          <Separator className="my-12" />

          {/* ───────────── SEARCH TYPES ───────────── */}
          <DocSection id="search-types" title="Search Types and FHIR Types" level={1}>
            <p>
              Search parameters are categorized by type, each with specific
              matching rules and capabilities. The basic types cover the most
              common use cases, while extended types provide additional
              functionality.
            </p>
          </DocSection>

          <DocSection id="basic-parameter-types" title="Basic Parameter Types" level={2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
              {[
                {
                  type: "date",
                  desc: "Search on date/time/period values",
                  example: "birthdate=2000-01-01",
                },
                {
                  type: "number",
                  desc: "Search on numeric values",
                  example: "probability=gt0.8",
                },
                {
                  type: "quantity",
                  desc: "Search on quantity values with units",
                  example: "value-quantity=5.4|http://unitsofmeasure.org|mg",
                },
                {
                  type: "reference",
                  desc: "Search on references to other resources",
                  example: "subject=Patient/123",
                },
                {
                  type: "string",
                  desc: "Search on string values",
                  example: "name=peter",
                },
                {
                  type: "token",
                  desc: "Search on coded values or identifiers",
                  example: "code=http://loinc.org|1234-5",
                },
                {
                  type: "uri",
                  desc: "Search on URI values",
                  example: "url=http://example.org/fhir",
                },
              ].map(({ type, desc, example }) => (
                <div
                  key={type}
                  className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-border/50 dark:border-brand-purple/10 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-purple" />
                    <span className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
                      {type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                  <code className="text-[10px] text-brand-teal bg-brand-teal/10 rounded-md px-2 py-0.5 block overflow-x-auto">
                    {example}
                  </code>
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection id="extended-parameter-types" title="Extended Parameter Types" level={2}>
            <div className="space-y-3 my-4">
              {[
                {
                  type: "composite",
                  desc: "Combine two or more parameters together as a single search value, linked with a $.",
                },
                {
                  type: "resource",
                  desc: "A parameter that matches a resource as a whole, based on resource-level properties.",
                },
                {
                  type: "special",
                  desc: "Special parameters that have unique processing rules or semantics not covered by other types.",
                },
              ].map(({ type, desc }) => (
                <div
                  key={type}
                  className="flex items-start gap-4 bg-muted/20 dark:bg-white/[0.03] border border-border/30 dark:border-brand-purple/10 rounded-xl p-4"
                >
                  <Badge className="bg-brand-purple text-white rounded-lg shrink-0">
                    {type}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </DocSection>

          <Separator className="my-12" />

          {/* ───────────── SPECIAL CONDITIONS ───────────── */}
          <DocSection id="special-conditions" title="Special Search Conditions" level={1}>
            <p>
              FHIR Search provides several specialized search capabilities for
              handling specific data patterns and complex query scenarios.
            </p>
          </DocSection>

          <DocSection id="searching-ranges" title="Searching Ranges" level={2}>
            <p>
              When searching on ranges (e.g., a period or a range of values), the
              search engine must determine overlap between the search value and the
              target range. The prefix determines how the comparison works against
              the boundaries of the range.
            </p>
          </DocSection>

          <DocSection id="searching-identifiers" title="Searching Identifiers" level={2}>
            <p>
              Identifiers are commonly used to detect specific resource instances.
              The token search type is used for searching on identifiers. Both the
              system and code/value can be specified:
            </p>
            <CodeBlock
              language="bash"
              title="Identifier Search"
              code={`GET [base]/Patient?identifier=http://example.com/fhir/mrn|12345
GET [base]/Patient?identifier=12345
GET [base]/Patient?identifier=|12345`}
            />
          </DocSection>

          <DocSection id="references-versions" title="References and Versions" level={2}>
            <p>
              Reference parameters can be searched with or without version
              information. The version can be appended to the reference value using
              the pipe character:
            </p>
            <CodeBlock
              language="bash"
              title="Reference with Version"
              code={`GET [base]/Observation?subject=Patient/123
GET [base]/Observation?subject=Patient/123/_history/2`}
            />
          </DocSection>

          <DocSection id="searching-hierarchies" title="Searching Hierarchies" level={2}>
            <p>
              For code systems that define a hierarchy, the{" "}
              <InlineCode>:above</InlineCode> and{" "}
              <InlineCode>:below</InlineCode> modifiers can be used to search for
              codes within the hierarchy. These modifiers enable finding resources
              coded at a more specific or more general level.
            </p>
            <CodeBlock
              language="bash"
              title="Hierarchy Search"
              code={`GET [base]/Condition?code:below=http://snomed.info/sct|73211009`}
            />
          </DocSection>

          <DocSection id="searching-mime-types" title="Searching MIME Types" level={2}>
            <p>
              When searching on MIME types, the search is performed on the{" "}
              <InlineCode>contentType</InlineCode> element. MIME type matching follows
              standard rules where a wildcard can be used in the subtype position.
            </p>
          </DocSection>

          <Separator className="my-12" />

          {/* ───────────── PAGINATED SEARCH ───────────── */}
          <PaginatedSearchSection />

          <Separator className="my-12" />

          {/* ───────────── CHAINED SEARCHES ───────────── */}
          <ChainingSection />

          <Separator className="my-12" />

          {/* ───────────── _filter PARAMETER ───────────── */}
          <FilterParameterSection />

          <Separator className="my-12" />

          {/* ───────────── ADVANCED SEARCH PARAMETERS ───────────── */}
          <AdvancedParamsSection />

          <Separator className="my-12" />

          {/* ───────────── MODIFYING RESULTS ───────────── */}
          <DocSection id="modifying-results" title="Modifying Search Results" level={1}>
            <p>
              Several parameters affect how search results are returned, including
              sorting, paging, and controlling the amount of data in each result.
            </p>
          </DocSection>

          <DocSection id="sorting" title="Sorting (_sort)" level={2}>
            <p>
              The <InlineCode>_sort</InlineCode> parameter indicates the order of
              results. A minus sign (<InlineCode>-</InlineCode>) prefix indicates
              descending order:
            </p>
            <CodeBlock
              language="bash"
              title="Sorting"
              code={`GET [base]/Observation?_sort=date
GET [base]/Observation?_sort=-date
GET [base]/Observation?_sort=patient,-date`}
            />
          </DocSection>

          <DocSection id="total" title="Total (_total)" level={2}>
            <p>
              The <InlineCode>_total</InlineCode> parameter controls whether the
              server should include a total count of matching resources. Values can
              be <InlineCode>none</InlineCode>, <InlineCode>estimate</InlineCode>,
              or <InlineCode>accurate</InlineCode>.
            </p>
          </DocSection>

          <DocSection id="count" title="Limiting Page Size (_count)" level={2}>
            <p>
              The <InlineCode>_count</InlineCode> parameter limits the number of
              results per page. It does not limit the total number of matches:
            </p>
            <CodeBlock
              language="bash"
              title="Paging with _count"
              code={`GET [base]/Patient?name=peter&_count=10`}
            />
          </DocSection>

          <DocSection id="summary" title="Summary (_summary)" level={2}>
            <p>
              The <InlineCode>_summary</InlineCode> parameter controls the amount
              of data returned for each resource:
            </p>
            <div className="my-4 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-white/[0.03]">
                    <th className="text-left px-4 py-2 font-semibold">Value</th>
                    <th className="text-left px-4 py-2 font-semibold">
                      Returns
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["true", "Summary elements only"],
                    ["text", "Text, id, meta, and top-level mandatory elements"],
                    ["data", "All elements except text"],
                    ["count", "Count of matching resources only"],
                    ["false", "All parts of the resource (default)"],
                  ].map(([val, desc]) => (
                    <tr key={val}>
                      <td className="px-4 py-2">
                        <InlineCode>{val}</InlineCode>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocSection>

          <DocSection id="elements" title="Selecting Elements (_elements)" level={2}>
            <p>
              The <InlineCode>_elements</InlineCode> parameter requests that only
              specific elements be returned for each resource:
            </p>
            <CodeBlock
              language="bash"
              title="Element Selection"
              code={`GET [base]/Patient?_elements=identifier,active,link`}
            />
          </DocSection>

          <DocSection id="score" title="Relevance (_score)" level={2}>
            <p>
              Servers may include relevance scores in search results using the{" "}
              <InlineCode>search.score</InlineCode> element on each entry. This is
              a decimal number between 0 and 1 indicating how relevant the entry is
              to the search criteria.
            </p>
          </DocSection>

          <Separator className="my-12" />

          {/* ───────────── INCLUDING LINKED RESOURCES ───────────── */}
          <IncludingResourcesSection />

          <Separator className="my-12" />

          {/* ───────────── STANDARD PARAMETERS ───────────── */}
          <DocSection id="standard-parameters" title="Standard Parameters" level={1}>
            <p>
              The following parameters apply to all resources and provide
              foundational search capabilities.
            </p>
          </DocSection>

          <DocSection id="params-all-resources" title="Parameters for All Resources" level={2}>
            <div className="my-4 rounded-xl border border-border dark:border-brand-purple/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 dark:bg-white/[0.03]">
                    <th className="text-left px-4 py-2 font-semibold">
                      Parameter
                    </th>
                    <th className="text-left px-4 py-2 font-semibold">Type</th>
                    <th className="text-left px-4 py-2 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["_id", "token", "Resource id"],
                    ["_lastUpdated", "date", "Last updated date"],
                    ["_tag", "token", "Resource tags"],
                    ["_profile", "uri", "Resource profiles"],
                    ["_security", "token", "Security labels"],
                    ["_source", "uri", "Source of the resource"],
                    ["_text", "special", "Full-text search on narrative"],
                    ["_content", "special", "Full-text search on content"],
                    ["_list", "special", "All resources in a list"],
                    ["_has", "special", "Reverse chaining"],
                    ["_type", "special", "Resource type filter"],
                  ].map(([param, type, desc]) => (
                    <tr key={param}>
                      <td className="px-4 py-2">
                        <InlineCode>{param}</InlineCode>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] rounded-md"
                        >
                          {type}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocSection>

          <DocSection id="text-search" title="Text Search Parameters" level={2}>
            <p>
              Two special parameters support full-text search:
            </p>
            <ul className="list-disc list-inside space-y-2 my-4 text-sm text-muted-foreground">
              <li>
                <InlineCode>_text</InlineCode> — searches on the narrative (
                <InlineCode>text</InlineCode>) of the resource
              </li>
              <li>
                <InlineCode>_content</InlineCode> — searches on the entire content
                of the resource
              </li>
            </ul>
          </DocSection>

          <Separator className="my-12" />

          {/* ───────────── GRAPHQL ───────────── */}
          <GraphQLSection />

          <Separator className="my-12" />

          {/* ───────────── CONFORMANCE ───────────── */}
          <DocSection id="conformance" title="Server Conformance" level={1}>
            <p>
              Servers declare their supported search capabilities through the{" "}
              <InlineCode>CapabilityStatement</InlineCode> resource. This enables
              clients to discover what search parameters, modifiers, and features
              are available.
            </p>
          </DocSection>

          <DocSection id="search-result-currency" title="Search Result Currency" level={2}>
            <p>
              Search results may not reflect the very latest state of the data.
              Servers should document any known delay between a write operation and
              when the data becomes available via search. The{" "}
              <InlineCode>_total</InlineCode> and last updated timestamp on the
              bundle help clients understand the currency of results.
            </p>
          </DocSection>

          <DocSection id="conformance-summary" title="Conformance Summary" level={2}>
            <p>
              The CapabilityStatement declares search conformance including:
            </p>
            <ul className="list-none space-y-2 my-4">
              {[
                "Which search parameters are supported per resource type",
                "Which modifiers and comparators are supported",
                "Whether include/revinclude is supported",
                "Whether chaining and reverse chaining are supported",
                "Which result parameters (_sort, _count, etc.) are supported",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <Search
                    size={14}
                    className="text-brand-teal shrink-0 mt-0.5"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </DocSection>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border dark:border-brand-purple/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-teal flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-[family-name:var(--font-poppins)]">
                    FHIR Search Documentation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    HL7 FHIR v3.2.1 · CI-Build
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <a
                  href="http://hl7.org/fhir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-purple dark:hover:text-brand-purple-light transition-colors flex items-center gap-1"
                >
                  HL7 FHIR Spec <ExternalLink size={10} />
                </a>
                <a
                  href="http://build.fhir.org/search-build.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-purple dark:hover:text-brand-purple-light transition-colors flex items-center gap-1"
                >
                  CI-Build <ExternalLink size={10} />
                </a>
                <span>
                  Responsible: FHIR Infrastructure Work Group
                </span>
              </div>
            </div>
            <div className="mt-6 pb-8 text-center">
              <p className="text-[10px] text-muted-foreground/50">
                Powered by Mindbowser · Built with Next.js & shadcn/ui
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

/* ─── Inline Components ─── */

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-brand-purple/10 dark:bg-brand-purple/15 text-brand-purple dark:text-brand-purple-light px-1.5 py-0.5 rounded-md text-[13px] font-mono font-medium">
      {children}
    </code>
  );
}

function ContextCard({
  title,
  badge,
  description,
  code,
}: {
  title: string;
  badge: string;
  description: string;
  code: string;
}) {
  return (
    <div className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-border/50 dark:border-brand-purple/10 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Badge className="bg-brand-purple text-white rounded-lg text-[10px]">
          {badge}
        </Badge>
        <h4 className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
          {title}
        </h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="bg-[#1A0F2C] rounded-lg px-4 py-2.5">
        <code className="text-brand-teal-light text-xs font-mono">{code}</code>
      </div>
    </div>
  );
}

function ModeCard({
  title,
  color,
  description,
}: {
  title: string;
  color: "purple" | "teal" | "neutral";
  description: string;
}) {
  const colorMap = {
    purple: "from-brand-purple to-brand-purple-light",
    teal: "from-brand-teal to-brand-teal-light",
    neutral: "from-[#5B5B5B] to-[#9A9A9A]",
  };
  return (
    <div className="bg-muted/30 dark:bg-white/[0.03] backdrop-blur-sm border border-border/50 dark:border-brand-purple/10 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full bg-gradient-to-br ${colorMap[color]}`}
        />
        <h4 className="font-semibold text-sm text-foreground font-[family-name:var(--font-poppins)]">
          {title}
        </h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ErrorRow({ issue, search }: { issue: string; search: string }) {
  return (
    <tr>
      <td className="px-4 py-2 text-muted-foreground">{issue}</td>
      <td className="px-4 py-2">
        <code className="text-[11px] text-brand-teal dark:text-brand-teal-light font-mono bg-brand-teal/5 dark:bg-brand-teal/10 rounded-md px-2 py-0.5">
          {search}
        </code>
      </td>
    </tr>
  );
}
