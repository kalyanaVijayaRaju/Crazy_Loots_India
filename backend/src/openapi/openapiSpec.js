/**
 * OpenAPI 3.0.0 Spec Generator
 */
class OpenApiSpec {
  static getSpec() {
    return {
      openapi: '3.0.0',
      info: {
        title: 'Crazy Loots India — Backend REST API Platform',
        version: '1.0.0',
        description: 'Complete production-grade REST API platform for deal discovery, product monitoring, Telegram publishing, and system observability.',
        contact: {
          name: 'Crazy Loots India Engineering',
          email: 'support@crazyloots.in',
        },
      },
      servers: [
        { url: 'http://localhost:5000/api/v1', description: 'Local Development Server (v1)' },
      ],
      paths: {
        '/pipeline/run': {
          post: {
            summary: 'Run End-to-End Deal Discovery Pipeline',
            description: 'Executes the full pipeline for an Amazon product URL from extraction to Telegram publishing (DRY_RUN mode).',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['url'],
                    properties: {
                      url: { type: 'string', example: 'https://www.amazon.in/dp/B08N5WRWNW' },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Pipeline execution report', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
              400: { description: 'Bad Request' },
              500: { description: 'Internal Server Error' },
            },
          },
        },
        '/products': {
          get: {
            summary: 'List Products',
            parameters: [
              { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
              { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
              { name: 'search', in: 'query', schema: { type: 'string' } },
            ],
            responses: { 200: { description: 'Paginated product list' } },
          },
          post: {
            summary: 'Create Product',
            requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
            responses: { 201: { description: 'Product created' } },
          },
        },
        '/products/{id}': {
          get: { summary: 'Get Product by ID', responses: { 200: { description: 'Product object' }, 404: { description: 'Not Found' } } },
          patch: { summary: 'Update Product', responses: { 200: { description: 'Updated product' } } },
          delete: { summary: 'Delete Product', responses: { 200: { description: 'Product deleted' } } },
        },
        '/monitoring/run': {
          post: { summary: 'Trigger Monitoring Cycle', responses: { 200: { description: 'Cycle executed' } } },
        },
        '/deals': {
          get: { summary: 'List Deals', responses: { 200: { description: 'Deals list' } } },
        },
        '/system/status': {
          get: { summary: 'System Status', responses: { 200: { description: 'Status overview' } } },
        },
      },
      components: {
        schemas: {
          ApiResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { type: 'object' },
              meta: { type: 'object' },
            },
          },
        },
      },
    };
  }
}

module.exports = OpenApiSpec;
