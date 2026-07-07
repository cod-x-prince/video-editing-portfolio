import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeout: NodeJS.Timeout | null = null;

  public state: State = {
    hasError: false,
    error: null,
    errorCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorCount = this.state.errorCount + 1;
    this.setState({ errorCount });

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Uncaught error:", error, errorInfo);
    }

    // In production, you could send to Sentry:
    // Sentry.captureException(error, { contexts: { react: errorInfo } });

    // Auto-retry after 30 seconds on first error
    if (errorCount === 1) {
      this.resetTimeout = setTimeout(() => {
        this.resetError();
      }, 30000);
    }
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null });
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }
  };

  public componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const isCritical = this.state.errorCount > 2;

      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h1 className="text-3xl font-syne font-bold mb-2">
            {isCritical ? "Critical Error" : "Something went wrong"}
          </h1>
          <p className="text-neutral-400 max-w-md mb-8">
            {isCritical
              ? "We're experiencing persistent issues. Please try refreshing your browser cache."
              : "We're sorry, but an unexpected error occurred. Please try refreshing the page."}
          </p>
          <div className="flex gap-4">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw size={18} /> Reload Page
            </button>
            {isCritical && (
              <button
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = "/";
                }}
              >
                Clear Cache & Home
              </button>
            )}
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <div>
              <p className="text-neutral-500 mt-8 text-sm">Error Count: {this.state.errorCount}</p>
              <pre className="mt-4 p-4 bg-neutral-900 rounded-lg text-left text-xs text-red-300 overflow-auto max-w-2xl border border-red-500/20">
                {this.state.error.toString()}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
