import { Component, type ErrorInfo, type ReactNode } from "react";
import { SisenseContextProvider } from "@sisense/sdk-ui";
import { LocalAdapter } from "../../data/localAdapter";
import type { AnalyticsProvider } from "./AnalyticsProvider";
import type { DashboardData } from "../../types";

export type SisenseConfig = {
  url: string;
  token: string;
  dataSource: string;
};

export class SisenseComposeProvider implements AnalyticsProvider {
  mode: "sisense" = "sisense";
  private readonly adapter = new LocalAdapter();

  loadDashboardData(): Promise<DashboardData> {
    // Keep local fallback active while Sisense mode is being configured.
    return this.adapter.loadDashboardData();
  }
}

export function readSisenseConfig(): SisenseConfig | null {
  const url = (import.meta.env.VITE_SISENSE_URL ?? "").trim();
  const token = (import.meta.env.VITE_SISENSE_TOKEN ?? "").trim();
  const dataSource = (import.meta.env.VITE_SISENSE_DATASOURCE ?? "").trim();

  if (!url || !token || !dataSource) {
    return null;
  }
  return { url, token, dataSource };
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SisenseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Sisense Compose SDK error caught by boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="sisenseMissing" style={{ minHeight: "150px" }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#fca5a5" }}>
            Sisense Connection Error
          </h3>
          <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
            {this.state.error?.message || "Token authentication was not successful. Check credentials."}
          </p>
          <small style={{ color: "#9ca3af", display: "block", marginTop: "10px" }}>
            Please verify your <code>VITE_SISENSE_URL</code> and <code>VITE_SISENSE_TOKEN</code> in your <code>.env</code> file.
          </small>
        </div>
      );
    }

    return this.props.children;
  }
}

export function SisenseModeBoundary({ children }: ErrorBoundaryProps) {
  const config = readSisenseConfig();
  if (!config) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundaryGroup>
      <SisenseErrorBoundary>
        <SisenseContextProvider
          url={config.url}
          token={config.token}
          defaultDataSource={config.dataSource as unknown as never}
        >
          {children}
        </SisenseContextProvider>
      </SisenseErrorBoundary>
    </ErrorBoundaryGroup>
  );
}

// Simple fallback grouping to catch nested context resolution issues
function ErrorBoundaryGroup({ children }: ErrorBoundaryProps) {
  return <>{children}</>;
}
