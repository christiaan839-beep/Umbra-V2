"use client";

import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[SOVEREIGN Error Boundary]:", error, errorInfo);
    // In production, send to Sentry or your error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[300px] p-8">
          <div className="max-w-md w-full bg-black/40 backdrop-blur-2xl border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-lg font-light text-white tracking-wider mb-2">
              {this.props.fallbackTitle || "Component Error"}
            </h3>
            <p className="text-xs text-neutral-500 font-mono mb-5 break-all">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2 mx-auto uppercase tracking-widest font-bold font-mono text-[10px] hover:bg-red-500/20 transition-all"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for ErrorBoundary
 */
export function WithErrorBoundary({ children, title }: { children: ReactNode; title?: string }) {
  return <ErrorBoundary fallbackTitle={title}>{children}</ErrorBoundary>;
}
