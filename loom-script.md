# Loom Script - 3 Minutes

## 0:00-0:20 - Hook

Vibe coding makes it easy to generate dashboards. But in Formula 1, a dashboard is not enough. Fans do not just want to see lap times. They want to understand where the race was won or lost.

## 0:20-0:50 - What I Built

I built F1 Pit Wall Insights: a Python-first analytics prototype using processed Formula 1 data, Streamlit, Pandas, and Plotly.

## 0:50-1:40 - Demo

Here we can see lap-time trends, driver delta, tyre degradation signals, and a Pit Wall Insights panel that explains the main strategy signals in plain English.

## 1:40-2:20 - Behind the Scenes

The app runs locally from committed CSV and JSON files, so there is no setup dependency on FastF1, Sisense credentials, or an MCP server. FastF1 remains available as the regeneration path for processed data.

## 2:20-2:50 - Sisense Story

The important part is the builder pattern: take a rich data source, turn it into reusable analytics, and prepare it for an embedded product experience. The local adapter works today. A Sisense adapter and Compose SDK path can replace it later.

## 2:50-3:00 - CTA

Clone the repo, run the Streamlit demo, inspect the adapter boundary, and connect Sisense when the instance is ready.
