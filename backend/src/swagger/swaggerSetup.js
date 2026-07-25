const express = require('express');
const OpenApiSpec = require('../openapi/openapiSpec');

/**
 * Swagger & OpenAPI UI Setup
 * Mounts interactive Swagger UI documentation and raw JSON specification endpoint
 */
class SwaggerSetup {
  static setup(app, prefix = '/api/v1') {
    const spec = OpenApiSpec.getSpec();

    // Raw OpenAPI JSON endpoint
    app.get(`${prefix}/docs/openapi.json`, (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(spec);
    });

    // Simple HTML Swagger UI fallback
    app.get(`${prefix}/docs`, (_req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Crazy Loots India — API Documentation</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
          <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin: 0; background: #fafafa; }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
          <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              window.ui = SwaggerUIBundle({
                url: "${prefix}/docs/openapi.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
              });
            };
          </script>
        </body>
        </html>
      `);
    });
  }
}

module.exports = SwaggerSetup;
