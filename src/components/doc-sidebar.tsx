"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import logoImg from "../../public/logo.png";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
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
  Code2,
  SlidersHorizontal,
  Plus,
  Minus,
  Type,
  ALargeSmall,
  Pin,
  PinOff,
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

export function DocSidebar({ children }: { readonly children?: ReactNode }) {
  const COLLAPSED_WIDTH = 56; // 3.5rem

  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;
  const [activeSection, setActiveSection] = useState("introduction");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["introduction"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const [fontWeight, setFontWeight] = useState<"normal" | "medium" | "bold">("normal");
  const navRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    // Restore pinned state (default: true)
    const savedPinned = localStorage.getItem("sidebarPinned");
    const pinned = savedPinned !== "false";
    setIsPinned(pinned);

    // Restore font scale
    const savedScale = localStorage.getItem("fontScale");
    if (savedScale) {
      const s = Number.parseInt(savedScale, 10);
      setFontScale(s);
      document.documentElement.style.fontSize = `${s}%`;
    }
    // Restore font weight
    const savedWeight = localStorage.getItem("fontWeight") as "normal" | "medium" | "bold" | null;
    if (savedWeight) {
      setFontWeight(savedWeight);
      document.documentElement.dataset.fontWeight = savedWeight;
    }
  }, []);

  const togglePin = useCallback(() => {
    setIsPinned((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarPinned", String(next));
      return next;
    });
  }, []);

  const changeFontScale = useCallback((delta: number) => {
    setFontScale((prev) => {
      const next = Math.min(150, Math.max(75, prev + delta));
      document.documentElement.style.fontSize = `${next}%`;
      localStorage.setItem("fontScale", String(next));
      return next;
    });
  }, []);

  const cycleFontWeight = useCallback(() => {
    setFontWeight((prev) => {
      const order: ("normal" | "medium" | "bold")[] = ["normal", "medium", "bold"];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      document.documentElement.dataset.fontWeight = next;
      localStorage.setItem("fontWeight", next);
      return next;
    });
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

  // Track active section on scroll — uses scroll position of section headings
  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;

    const allIds = sections.flatMap((s) => [
      s.id,
      ...(s.children?.map((c) => c.id) || []),
    ]);

    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const containerRect = root.getBoundingClientRect();
        const offset = 120; // px from top of container to consider "current"

        let currentId = allIds[0];
        for (const id of allIds) {
          const el = document.getElementById(id);
          if (el) {
            const relativeTop = el.getBoundingClientRect().top - containerRect.top;
            if (relativeTop <= offset) {
              currentId = id;
            } else {
              break;
            }
          }
        }

        setActiveSection(currentId);
        // Auto-expand parent section
        for (const section of sections) {
          if (section.id === currentId || section.children?.some((c) => c.id === currentId)) {
            setExpandedSections((prev) => new Set([...prev, section.id]));
            break;
          }
        }
      });
    };

    root.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => {
      root.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isPinned]);

  // Auto-scroll sidebar nav so the active item stays visible (contained within sidebar)
  useEffect(() => {
    if (!activeSection || !navRef.current) return;
    const activeEl = navRef.current.querySelector(
      `[data-section-id="${activeSection}"]`
    ) as HTMLElement | null;
    if (!activeEl) return;

    const container = navRef.current;
    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();

    if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
      const scrollOffset = elRect.top - containerRect.top - containerRect.height / 3;
      container.scrollTo({
        top: container.scrollTop + scrollOffset,
        behavior: "smooth",
      });
    }
  }, [activeSection]);

  const filteredSections = searchQuery
    ? sections.filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.children?.some((c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    : sections;

  /* ─── Sidebar inner content (shared between pinned/unpinned layouts) ─── */
  const sidebarContent = (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Logo area */}
      <div className={`flex items-center py-5 border-b border-white/8 shrink-0 ${isExpanded ? "gap-3 px-3" : "px-3 justify-center"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoImg.src}
          alt="Mindbowser Logo"
          width={32}
          height={32}
          className="w-8 h-8 min-w-8 min-h-8 shrink-0"
        />
        <div
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? "opacity-100 flex-1 w-auto" : "opacity-0 w-0 min-w-0"
            }`}
        >
          <h2 className="text-white font-semibold text-sm whitespace-nowrap font-(family-name:--font-poppins)">
            FHIR Search
          </h2>
          <p className="text-white/40 text-[10px] whitespace-nowrap">
            HL7 Documentation
          </p>
        </div>
        {/* Pin / Unpin button */}
        <button
          onClick={togglePin}
          className={`shrink-0 rounded-lg transition-all duration-200 hover:bg-white/8 ${isExpanded ? "opacity-100 p-1.5" : "opacity-0 pointer-events-none w-0 min-w-0 p-0 overflow-hidden"
            }`}
          aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
        >
          {isPinned ? (
            <Pin size={14} className="text-brand-teal-light" />
          ) : (
            <PinOff size={14} className="text-white/40" />
          )}
        </button>
      </div>

      {/* Search */}
      <div
        className={`px-3 border-b border-white/8 transition-all duration-300 shrink-0 overflow-hidden ${isExpanded ? "opacity-100 max-h-20 py-3" : "opacity-0 pointer-events-none max-h-0 py-0"
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
            className="w-full bg-white/6 backdrop-blur-sm rounded-lg border border-white/8 px-3 py-1.5 pl-8 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/30 transition-all"
          />
        </div>
      </div>

      {/* Navigation - native scrollable */}
      <div
        ref={navRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin ${isExpanded ? "px-2" : "px-1"}`}
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
                <div className={`flex items-center ${!isExpanded ? "justify-center" : ""}`}>
                  <button
                    onClick={() => {
                      handleSectionClick(section.id);
                      if (!isSectionExpanded && section.children) {
                        toggleSection(section.id);
                      }
                    }}
                    data-section-id={section.id}
                    className={`flex items-center rounded-lg text-left transition-all duration-200 group/item ${isExpanded
                      ? `flex-1 gap-2.5 px-2.5 py-2 ${isActive
                        ? "bg-white/8 backdrop-blur-sm text-brand-teal-light"
                        : "text-white/60 hover:bg-white/4 hover:text-white/90"
                      }`
                      : `w-10 h-10 justify-center ${isActive
                        ? "bg-white/8 text-brand-teal-light"
                        : "text-white/60 hover:bg-white/4 hover:text-white/90"
                      }`
                      }`}
                    title={!isExpanded ? section.title : undefined}
                  >
                    <Icon
                      size={16}
                      className={`shrink-0 transition-colors ${isActive ? "text-brand-teal" : "text-white/40 group-hover/item:text-white/60"
                        }`}
                    />
                    {isExpanded && (
                      <span className="text-xs font-medium whitespace-nowrap flex-1">
                        {section.title}
                      </span>
                    )}
                  </button>
                  {/* Separate chevron toggle for expand/collapse */}
                  {isExpanded && section.children && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(section.id);
                      }}
                      className="shrink-0 p-1.5 rounded-md hover:bg-white/6 transition-colors mr-1"
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
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${isSectionExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="ml-4 pl-3 border-l border-white/8 mt-0.5 space-y-0.5">
                      {section.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleSectionClick(child.id)}
                          data-section-id={child.id}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${activeSection === child.id
                            ? "text-brand-teal-light bg-brand-teal/8"
                            : "text-white/40 hover:text-white/70 hover:bg-white/4"
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

      {/* Footer with controls */}
      <div className={`py-3 border-t border-white/8 shrink-0 space-y-2 ${isExpanded ? "px-3" : "px-1"}`}>
        {/* Typography controls — only visible when expanded */}
        <div
          className={`transition-all duration-300 overflow-hidden ${isExpanded ? "opacity-100 max-h-24" : "opacity-0 max-h-0"
            }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Size</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => changeFontScale(-10)}
                disabled={fontScale <= 75}
                className="p-1 rounded-md hover:bg-white/8 disabled:opacity-30 transition-colors"
                aria-label="Decrease font size"
              >
                <Minus size={12} className="text-white/60" />
              </button>
              <span className="text-[10px] text-white/50 w-8 text-center tabular-nums">
                {fontScale}%
              </span>
              <button
                onClick={() => changeFontScale(10)}
                disabled={fontScale >= 150}
                className="p-1 rounded-md hover:bg-white/8 disabled:opacity-30 transition-colors"
                aria-label="Increase font size"
              >
                <Plus size={12} className="text-white/60" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Weight</span>
            <button
              onClick={cycleFontWeight}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-white/8 transition-colors"
              aria-label="Cycle font weight"
            >
              <Type size={12} className="text-white/60" />
              <span className="text-[10px] text-white/50 capitalize">{fontWeight}</span>
            </button>
          </div>
        </div>

        {/* Bottom row: version + dark mode / collapsed: icons only */}
        <div className={`flex items-center ${isExpanded ? "justify-between" : "flex-col gap-1"}`}>
          {isExpanded && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              <span className="text-[10px] text-white/30 whitespace-nowrap">
                FHIR CI-Build v3.2.1
              </span>
            </div>
          )}
          <div className={`flex items-center ${isExpanded ? "gap-0.5" : "flex-col gap-1"}`}>
            {/* Font size shortcut when collapsed */}
            {!isExpanded && (
              <button
                onClick={() => changeFontScale(10)}
                className="p-1.5 rounded-lg transition-all duration-200 hover:bg-white/8"
                aria-label="Increase font size"
              >
                <ALargeSmall size={14} className="text-white/50" />
              </button>
            )}
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg transition-all duration-200 hover:bg-white/8"
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
  );

  /* ─── When PINNED: use ResizablePanel layout ─── */
  if (isPinned) {
    return (
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-screen"
      >
        <ResizablePanel
          defaultSize="18%"
          minSize="12%"
          maxSize="30%"
        >
          <nav
            className="h-full relative"
            aria-label="Main sidebar"
          >
            {/* Solid background when pinned */}
            <div className="absolute inset-0 bg-brand-dark shadow-2xl shadow-brand-purple/10" />
            {sidebarContent}
          </nav>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-transparent hover:bg-brand-teal/20 active:bg-brand-teal/40 transition-colors data-[resize-handle-active]:bg-brand-teal/40" />

        <ResizablePanel defaultSize="82%">
          <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto"
            style={{ scrollBehavior: "smooth" }}
          >
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  /* ─── When UNPINNED: fixed overlay sidebar + padded children ─── */
  return (
    <>
      <nav
        className="fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out"
        style={{ width: isExpanded ? 288 : COLLAPSED_WIDTH }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Main sidebar"
      >
        {/* Glassmorphic background */}
        <div className="absolute inset-0 bg-brand-dark/85 backdrop-blur-2xl shadow-2xl shadow-brand-purple/10 border-r border-white/8" />
        {/* Gradient accent line */}
        <div className="absolute top-0 right-0 w-0.5 h-full bg-linear-to-b from-brand-purple via-brand-teal to-brand-purple opacity-30" />
        {/* Subtle glass shine */}
        <div className="absolute inset-0 bg-linear-to-br from-white/4 via-transparent to-white/2 pointer-events-none" />
        {sidebarContent}
      </nav>
      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto"
        style={{ paddingLeft: `${COLLAPSED_WIDTH}px`, scrollBehavior: "smooth" }}
      >
        {children}
      </div>
    </>
  );
}