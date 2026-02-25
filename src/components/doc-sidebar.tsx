"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import logoImg from "../../public/logo.png";
import {
  Search,
  BookOpen,
  FileText,
  Link,
  Filter,
  ChevronRight,
  ChevronDown,
  Hash,
  Database,
  Settings,
  Layers,
  Globe,
  List,
  Zap,
  Package,
  Shield,
  Moon,
  Sun,
  GitBranch,
  Code2,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface SidebarSection {
  id: string;
  title: string;
  icon: LucideIcon;
  children?: { id: string; title: string }[];
}

const sections: SidebarSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: BookOpen,
    children: [
      { id: "url-encoding", title: "URL-Encoding" },
      { id: "search-overview", title: "Search Overview" },
      { id: "search-inputs", title: "Search Inputs" },
      { id: "search-contexts", title: "Search Contexts" },
    ],
  },
  {
    id: "search-responses",
    title: "Search Responses",
    icon: FileText,
    children: [
      { id: "bundle-type", title: "Bundle Type" },
      { id: "self-link", title: "Self Link" },
      { id: "paging", title: "Paging" },
      { id: "matches-inclusions-outcomes", title: "Matches & Inclusions" },
      { id: "handling-errors", title: "Handling Errors" },
    ],
  },
  {
    id: "transport-protocols",
    title: "Transport Protocols",
    icon: Globe,
    children: [
      { id: "multi-datastore", title: "Multi-datastore" },
      { id: "batching-searches", title: "Batching Searches" },
    ],
  },
  {
    id: "search-parameters",
    title: "Search Parameters",
    icon: Filter,
    children: [
      { id: "search-test-basics", title: "Test Basics" },
      { id: "matching-cardinality", title: "Matching & Cardinality" },
      { id: "multiple-values", title: "Multiple Values" },
      { id: "modifiers", title: "Modifiers" },
      { id: "prefixes", title: "Prefixes" },
      { id: "escaping", title: "Escaping" },
    ],
  },
  {
    id: "search-types",
    title: "Search Types & FHIR Types",
    icon: Database,
    children: [
      { id: "basic-parameter-types", title: "Basic Parameter Types" },
      { id: "extended-parameter-types", title: "Extended Parameter Types" },
    ],
  },
  {
    id: "special-conditions",
    title: "Special Search Conditions",
    icon: Zap,
    children: [
      { id: "searching-ranges", title: "Searching Ranges" },
      { id: "searching-identifiers", title: "Searching Identifiers" },
      { id: "references-versions", title: "References & Versions" },
      { id: "searching-hierarchies", title: "Searching Hierarchies" },
      { id: "searching-mime-types", title: "Searching MIME Types" },
    ],
  },
  {
    id: "paginated-search",
    title: "Paginated Search",
    icon: SlidersHorizontal,
    children: [
      { id: "offset-pagination", title: "Offset-based" },
      { id: "cursor-pagination", title: "Cursor-based" },
      { id: "page-size-count", title: "Page Size (_count)" },
      { id: "total-results", title: "Total (_total)" },
      { id: "sort-pagination", title: "Sorting & Pagination" },
    ],
  },
  {
    id: "advanced-params",
    title: "Advanced Parameters",
    icon: Settings,
    children: [
      { id: "param-id", title: "_id" },
      { id: "param-last-updated", title: "_lastUpdated" },
      { id: "param-summary", title: "_summary" },
      { id: "param-elements", title: "_elements" },
      { id: "param-tag", title: "_tag" },
      { id: "param-compartment", title: "_compartment" },
      { id: "param-profile", title: "_profile" },
      { id: "param-security", title: "_security" },
      { id: "param-source", title: "_source" },
    ],
  },
  {
    id: "filter-parameter",
    title: "_filter Parameter",
    icon: Filter,
    children: [
      { id: "filter-syntax", title: "Filter Syntax" },
      { id: "filter-examples", title: "Filter Examples" },
      { id: "filter-advanced", title: "Advanced Patterns" },
    ],
  },
  {
    id: "chaining",
    title: "Chaining Searches",
    icon: Link,
    children: [
      { id: "forward-chaining", title: "Forward Chaining" },
      { id: "reverse-chaining", title: "Reverse Chaining (_has)" },
      { id: "nested-reverse-chaining", title: "Nested Reverse Chains" },
      { id: "combined-chaining", title: "Combined Chaining" },
    ],
  },
  {
    id: "including-resources",
    title: "Including Resources",
    icon: Package,
    children: [
      { id: "include-revinclude-detail", title: "_include & _revinclude" },
      { id: "iterate-modifier", title: ":iterate Modifier" },
      { id: "graphql-vs-include", title: "GraphQL vs _include" },
    ],
  },
  {
    id: "modifying-results",
    title: "Modifying Results",
    icon: Layers,
    children: [
      { id: "sorting", title: "Sorting (_sort)" },
      { id: "total", title: "Total (_total)" },
      { id: "count", title: "Page Size (_count)" },
      { id: "summary", title: "Summary (_summary)" },
      { id: "elements", title: "Elements (_elements)" },
      { id: "score", title: "Relevance (_score)" },
    ],
  },
  {
    id: "graphql",
    title: "GraphQL",
    icon: Code2,
    children: [
      { id: "graphql-overview", title: "Overview" },
      { id: "invoking-graphql", title: "Invoking GraphQL" },
      { id: "field-selection", title: "Field Selection" },
      { id: "mutations", title: "Mutations" },
      { id: "query-limits", title: "Query Limits" },
    ],
  },
  {
    id: "standard-parameters",
    title: "Standard Parameters",
    icon: List,
    children: [
      { id: "params-all-resources", title: "All Resources" },
      { id: "text-search", title: "Text Search" },
    ],
  },
  {
    id: "conformance",
    title: "Server Conformance",
    icon: Shield,
    children: [
      { id: "search-result-currency", title: "Result Currency" },
      { id: "conformance-summary", title: "Conformance Summary" },
    ],
  },
];

export function DocSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["introduction"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Initialize dark mode from localStorage / system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (stored !== "light" && prefersDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setIsDark(shouldBeDark ?? false);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  }, []);

  const handleSectionClick = useCallback((id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveSection(id);
          // Auto-expand parent section
          for (const section of sections) {
            if (section.id === id || section.children?.some((c) => c.id === id)) {
              setExpandedSections((prev) => new Set([...prev, section.id]));
              break;
            }
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    const allIds = sections.flatMap((s) => [
      s.id,
      ...(s.children?.map((c) => c.id) || []),
    ]);
    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const filteredSections = searchQuery
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.children?.some((c) =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : sections;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out ${
          isExpanded ? "w-72" : "w-14"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Glassmorphic background */}
        <div className="absolute inset-0 bg-[#1A0F2C]/85 backdrop-blur-2xl shadow-2xl shadow-brand-purple/10 border-r border-white/[0.08]" />

        {/* Gradient accent line */}
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-brand-purple via-brand-teal to-brand-purple opacity-30" />

        {/* Subtle glass shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.02] pointer-events-none" />

        {/* Content */}
        <div className="relative h-full flex flex-col overflow-hidden">
          {/* Logo area */}
          <div className="flex items-center gap-3 px-3 py-5 border-b border-white/[0.08] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoImg.src}
              alt="FHIR Search Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-xl shrink-0 shadow-lg shadow-brand-purple/20"
            />
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              <h2 className="text-white font-semibold text-sm whitespace-nowrap font-[family-name:var(--font-poppins)]">
                FHIR Search
              </h2>
              <p className="text-white/40 text-[10px] whitespace-nowrap">
                HL7 Documentation
              </p>
            </div>
          </div>

          {/* Search */}
          <div
            className={`px-3 py-3 border-b border-white/[0.08] transition-all duration-300 shrink-0 ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none h-0 py-0 overflow-hidden"
            }`}
          >
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.06] backdrop-blur-sm rounded-lg border border-white/[0.08] px-3 py-1.5 pl-8 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/30 transition-all"
              />
            </div>
          </div>

          {/* Navigation - native scrollable */}
          <div
            ref={navRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 scrollbar-thin"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.15) transparent",
            }}
          >
            <nav className="space-y-0.5">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isActive =
                  activeSection === section.id ||
                  section.children?.some((c) => c.id === activeSection);
                const isSectionExpanded = expandedSections.has(section.id);

                return (
                  <div key={section.id}>
                    {/* Parent item */}
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          handleSectionClick(section.id);
                          // Auto-expand when navigating to parent
                          if (!isSectionExpanded && section.children) {
                            toggleSection(section.id);
                          }
                        }}
                        className={`flex-1 flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-200 group/item ${
                          isActive
                            ? "bg-white/[0.08] backdrop-blur-sm text-brand-teal-light"
                            : "text-white/60 hover:bg-white/[0.04] hover:text-white/90"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={`shrink-0 transition-colors ${
                            isActive ? "text-brand-teal" : "text-white/40 group-hover/item:text-white/60"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium whitespace-nowrap transition-all duration-300 flex-1 ${
                            isExpanded ? "opacity-100" : "opacity-0 w-0"
                          }`}
                        >
                          {section.title}
                        </span>
                      </button>
                      {/* Separate chevron toggle for expand/collapse */}
                      {isExpanded && section.children && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(section.id);
                          }}
                          className="shrink-0 p-1.5 rounded-md hover:bg-white/[0.06] transition-colors mr-1"
                          aria-label={isSectionExpanded ? "Collapse section" : "Expand section"}
                        >
                          {isSectionExpanded ? (
                            <ChevronDown size={12} className="text-white/40" />
                          ) : (
                            <ChevronRight size={12} className="text-white/40" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Children - animated expand/collapse */}
                    {isExpanded && section.children && (
                      <div
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${
                          isSectionExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="ml-4 pl-3 border-l border-white/[0.08] mt-0.5 space-y-0.5">
                          {section.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleSectionClick(child.id)}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                                activeSection === child.id
                                  ? "text-brand-teal-light bg-brand-teal/[0.08]"
                                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                              }`}
                            >
                              <Hash size={10} className="shrink-0 opacity-50" />
                              <span className="text-[11px] whitespace-nowrap">
                                {child.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer with dark mode toggle */}
          <div className="px-3 py-3 border-t border-white/[0.08] shrink-0">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                <span className="text-[10px] text-white/30 whitespace-nowrap">
                  FHIR CI-Build v3.2.1
                </span>
              </div>
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-1.5 rounded-lg transition-all duration-200 hover:bg-white/[0.08] ${
                  isExpanded ? "" : "mx-auto"
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun size={14} className="text-brand-teal-light" />
                ) : (
                  <Moon size={14} className="text-white/50" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
