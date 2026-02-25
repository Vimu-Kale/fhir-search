"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  readonly code: string;
  readonly language?: string;
  readonly title?: string;
}

export function CodeBlock({ code, language = "bash", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden border border-brand-purple/10 dark:border-brand-purple/15 my-4 shadow-sm dark:shadow-brand-purple/5">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-brand-dark border-b border-white/8">
          <span className="text-xs font-medium text-brand-teal-light font-mono">
            {title}
          </span>
        </div>
      )}
      <div className="relative">
        <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-4 overflow-x-auto text-sm leading-relaxed`}
              style={{ ...style, background: "#1A0F2C", margin: 0 }}
            >
              {tokens.map((line, i) => {
                const lineId = line.map(t => t.content).join("").trim() || `l${i}`;
                const { key: _lineKey, ...lineProps } = getLineProps({ line, key: i });
                return (
                  <div key={lineId} {...lineProps}>
                    <span className="inline-block w-8 text-right mr-4 text-white/20 select-none text-xs">
                      {i + 1}
                    </span>
                    {line.map((token, j) => {
                      const { key: _tokenKey, ...tokenProps } = getTokenProps({ token, key: j });
                      return <span key={`token-${i}-${j}`} {...tokenProps} />;
                    })}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
