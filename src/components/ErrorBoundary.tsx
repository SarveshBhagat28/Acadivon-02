import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'An unexpected error occurred.';
      try {
        const parsedError = JSON.parse(this.state.error?.message || '');
        if (parsedError.error) {
          errorMessage = `Firebase Error: ${parsedError.error} during ${parsedError.operationType} on ${parsedError.path}`;
        }
      } catch (e) {
        // Not a JSON error
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border border-red-500/20 p-10 rounded-[2.5rem] max-w-md space-y-6">
            <div className="size-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            <p className="text-slate-400 text-sm">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-bold transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
