# Loom Script — F1 Pit Wall Insights (3-Minute Demo)

This script is designed for a 3-minute video pitch/walkthrough for the Sisense Builder Evangelist role, highlighting hands-on engineering, strategic vision, and developers' narrative.

---

## ⏱️ 0:00–0:20 | The Hook: Beyond Dashboards

> "Vibe coding makes it easy for anyone to spin up a dashboard in minutes. But in Formula 1, a simple dashboard isn't enough.
> 
> Race engineers on the pit wall don't just want to see generic charts — they need to understand exactly **where the race was won or lost**, in real-time.
> 
> The chart is not the product. The **embedded decision experience** is."

---

## ⏱️ 0:20–0:50 | The Build: F1 Pit Wall Prototype

> "To show how to build this experience, I built **F1 Pit Wall Insights**.
> 
> This is a React, Vite, and TypeScript application. The pipeline starts with raw telemetry and timing data extracted from the **FastF1 Python library**, which is processed into analytics-ready tables like laps, stints, and driver deltas.
> 
> What makes this prototype unique is its architecture: it supports a zero-friction **Local Mode** that runs immediately on public processed data, and a production-ready **Sisense Mode** backed by the **Sisense Compose SDK**."

---

## ⏱️ 0:50–1:40 | The Demo: Turning Telemetry into Decisions

> "Let's look at the app. We're looking at the 2024 Bahrain Grand Prix — Max Verstappen vs Sergio Perez.
> 
> At the top, we have our key pit wall metrics: fastest lap, average pace gap, stint drop, and our turning point.
> 
> As we scroll, we see:
> 1. **Lap Time Trend**: Visualizing overall stint pace.
> 2. **Driver Delta**: Showing exactly on which lap the gap opened up.
> 3. **Tyre Degradation**: Identifying the exact point where tyre performance dropped off.
> 
> And finally, the **Pit Wall AI Co-Pilot**: an interactive telemetry console simulating GP, Max Verstappen's race engineer. 
> 
> Instead of a static dashboard, developers can type freeform tactical questions or click presets like Tyre Wear, Stint Strategy, or the Race Turning Point to "talk to the data" and receive mathematically sound telemetry analyses in real-time.
> 
> We are running in **Local Mode** right now, rendering local data immediately using Recharts."

---

## ⏱️ 1:40–2:20 | Behind the Scenes: The Sisense Compose SDK Transition

> "Now, here is where it gets interesting for developers.
> 
> Vibe coding is great for prototyping the UI. But building a governed, filterable, scalable analytics layer from scratch is painful.
> 
> To help developers build their own cube, I placed clean F1 telemetry CSVs in the repository root to upload to Sisense and build an ElastiCube in minutes.
> 
> When we toggle **Sisense Mode**, we wrap our components in the `SisenseContextProvider` and render a native React component (`SisenseLapTimeChart`) directly from our Sisense data model using `@sisense/sdk-ui`.
> 
> And if the trial's AWS S3 permissions are blocked or credentials aren't configured yet, the component **fails gracefully** with a clean error boundary and clear developer fallback instructions, keeping the rest of the application fully functional."

---

## ⏱️ 2:20–2:50 | The Strategy: Why Compose SDK for AI Builders

> "This starter kit highlights a massive shift in how modern software is built.
> 
> AI coders can build features fast. But they need trusted, governed, reusable data infrastructure.
> 
> Sisense Compose SDK fits perfectly into the **vibe-coding workflow**. It allows developer-advocates, SaaS founders, and product engineers to:
> - Define their metrics once in a governed data model.
> - Generate TypeScript type definitions using `npx @sisense/sdk-cli get-data-model`.
> - Render charts and filter states natively in code while keeping the engine governed."

---

## ⏱️ 2:50–3:00 | The Call to Action (CTA)

> "The repo is open-source, fully documented, and includes a set of Cursor/Claude builder prompts to let you recreate or extend this exact flow.
> 
> Clone the repo, run local mode in minutes, connect your Sisense Trial, and start building. Let's build what matters!"
