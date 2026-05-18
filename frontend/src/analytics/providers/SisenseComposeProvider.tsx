import type { PropsWithChildren } from "react";
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

export function SisenseModeBoundary({ children }: PropsWithChildren) {
  const config = readSisenseConfig();
  if (!config) {
    return <>{children}</>;
  }

  return (
    <SisenseContextProvider
      url={config.url}
      token={config.token}
      defaultDataSource={config.dataSource as unknown as never}
    >
      {children}
    </SisenseContextProvider>
  );
}

