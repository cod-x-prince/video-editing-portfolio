import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // TODO: Send to Sentry or other monitoring service
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h1 className="text-3xl font-syne font-bold mb-2">
            Something went wrong
          </h1>
          <p className="text-neutral-400 max-w-md mb-8">
            We're sorry, but an unexpected error occurred. Please try refreshing
            the page.
          </p>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={18} /> Reload Page
          </button>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-8 p-4 bg-neutral-900 rounded-lg text-left text-xs text-red-300 overflow-auto max-w-2xl border border-red-500/20">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
