"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Premium markdown renderer for AI tool outputs.
 * Renders headers, lists, bold/italic, code blocks, and tables
 * with UMBRA's dark theme styling.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`umbra-markdown ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mb-4 mt-6 pb-2 border-b border-[#00B7FF]/20 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mb-3 mt-5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold text-[#00B7FF] uppercase tracking-widest mb-2 mt-4 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 mt-3">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm text-neutral-300 leading-relaxed mb-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 mb-4 ml-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 mb-4 ml-1 list-decimal list-inside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-neutral-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B7FF]/50 mt-2 shrink-0" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-emerald-400 not-italic font-medium">{children}</em>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-black/60 border border-[#00B7FF]/10 rounded-xl p-4 text-xs text-emerald-400 font-mono overflow-x-auto mb-4">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-[#00B7FF]/10 text-[#00B7FF] px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-4">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#00B7FF]/30 pl-4 py-1 mb-4 bg-[#00B7FF]/5 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="border-t border-[#00B7FF]/10 my-6" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4 rounded-xl border border-[#00B7FF]/10">
              <table className="w-full text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#00B7FF]/5 border-b border-[#00B7FF]/10">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#00B7FF]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-neutral-300 border-b border-white/5">
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#00B7FF] hover:underline">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
