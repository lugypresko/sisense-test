from __future__ import annotations


class SisenseAdapter:
    """Future integration point for Sisense-backed analytics.

    This local-first prototype intentionally does not require a Sisense
    instance, API token, trial workspace, or MCP server.

    Future paths:
    - Backend query path: connect to Sisense REST APIs from Python when a
      Sisense URL and API token are available.
    - Embedded frontend path: replace the Streamlit presentation layer with
      a React app that uses Sisense Compose SDK charts and queries.
    - MCP path: use https://github.com/sisense/sisense-mcp-server for
      developer workflows such as exploring data sources and generating chart
      definitions from a configured Sisense instance.
    """

    def load(self):  # pragma: no cover - documented stub only
        raise NotImplementedError(
            "Sisense integration is optional. Configure a Sisense instance and "
            "API token before implementing this adapter."
        )
