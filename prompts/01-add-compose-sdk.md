Add Sisense Compose SDK support to the existing F1 Pit Wall React app.

Goals:
- Keep local mode fully working without credentials.
- Add sisense mode that uses SisenseContextProvider.
- Read env vars:
  - VITE_ANALYTICS_PROVIDER
  - VITE_SISENSE_URL
  - VITE_SISENSE_TOKEN
  - VITE_SISENSE_DATASOURCE

Do not rebuild the app. Refactor minimally.
