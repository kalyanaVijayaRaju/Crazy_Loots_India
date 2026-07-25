/**
 * Phase 16: Application Layer & Comprehensive REST API Platform — Test Suite
 *
 * Tests every REST API endpoint and middleware across the platform.
 */

const http = require('http');
const app = require('./backend/src/app');

let server;
let baseUrl;

const assert = (condition, message) => {
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
};

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${path}`;
    const parsedUrl = new URL(url);

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (_e) { json = body; }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Phase 16: Application Layer — Integration Test Suite');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Start HTTP Server for testing
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`  🚀 Test server running on ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // ──── 1. Middlewares & Headers ────
    console.log('── 1. Middlewares & Headers ──');
    const systemRes = await request('/api/v1/system/version');
    assert(systemRes.statusCode === 200, 'System version endpoint returned 200');
    assert(systemRes.headers['x-request-id'], 'X-Request-ID header present');
    assert(systemRes.headers['x-trace-id'], 'X-Trace-ID header present');
    assert(systemRes.headers['x-correlation-id'], 'X-Correlation-ID header present');
    assert(systemRes.headers['x-response-time'], 'X-Response-Time header present');
    assert(systemRes.headers['x-ratelimit-limit'], 'RateLimit-Limit header present');
    console.log('');

    // ──── 2. System APIs ────
    console.log('── 2. System APIs ──');
    const statusRes = await request('/api/v1/system/status');
    assert(statusRes.statusCode === 200, 'GET /system/status returned 200');
    assert(statusRes.body.data.appName === 'Crazy Loots India', 'App name matches');

    const versionRes = await request('/api/v1/system/version');
    assert(versionRes.body.data.phase === 16, 'Phase 16 version returned');

    const configRes = await request('/api/v1/system/configuration');
    assert(configRes.statusCode === 200, 'GET /system/configuration returned 200');

    const flagsRes = await request('/api/v1/system/feature-flags');
    assert(flagsRes.statusCode === 200, 'GET /system/feature-flags returned 200');
    console.log('');

    // ──── 3. Admin APIs ────
    console.log('── 3. Admin APIs ──');
    const seedRes = await request('/api/v1/admin/seed', { method: 'POST' });
    assert(seedRes.statusCode === 200, 'POST /admin/seed returned 200');

    const reindexRes = await request('/api/v1/admin/reindex', { method: 'POST' });
    assert(reindexRes.statusCode === 200, 'POST /admin/reindex returned 200');

    const replayRes = await request('/api/v1/admin/replay', { method: 'POST', body: { executionId: 'exec_test' } });
    assert(replayRes.statusCode === 200, 'POST /admin/replay returned 200');
    console.log('');

    // ──── 4. Product APIs ────
    console.log('── 4. Product APIs ──');
    const createProductRes = await request('/api/v1/products', {
      method: 'POST',
      body: {
        url: 'https://www.amazon.in/dp/B08N5WRWNW',
        title: 'Sony WH-1000XM4 Headphones',
        currentPrice: 19990,
        originalPrice: 29990,
      },
    });
    assert(createProductRes.statusCode === 201, 'POST /products returned 201');
    const createdProduct = createProductRes.body.data;
    assert(createdProduct.id, 'Product created with ID');

    const listProductsRes = await request('/api/v1/products?page=1&limit=5');
    assert(listProductsRes.statusCode === 200, 'GET /products returned 200');
    assert(listProductsRes.body.meta.pagination.total >= 1, 'Products list returned paginated items');

    const getProductRes = await request(`/api/v1/products/${createdProduct.id}`);
    assert(getProductRes.statusCode === 200, 'GET /products/:id returned 200');

    const updateProductRes = await request(`/api/v1/products/${createdProduct.id}`, {
      method: 'PATCH',
      body: { rating: 4.8 },
    });
    assert(updateProductRes.statusCode === 200, 'PATCH /products/:id returned 200');

    const monitorProdRes = await request(`/api/v1/products/${createdProduct.id}/monitor`, { method: 'POST' });
    assert(monitorProdRes.statusCode === 200, 'POST /products/:id/monitor returned 200');

    const extractProdRes = await request(`/api/v1/products/${createdProduct.id}/extract`, { method: 'POST' });
    assert(extractProdRes.statusCode === 200, 'POST /products/:id/extract returned 200');

    const replayProdRes = await request(`/api/v1/products/${createdProduct.id}/replay`, { method: 'POST' });
    assert(replayProdRes.statusCode === 200, 'POST /products/:id/replay returned 200');

    const historyProdRes = await request(`/api/v1/products/${createdProduct.id}/history`);
    assert(historyProdRes.statusCode === 200, 'GET /products/:id/history returned 200');

    const pricesProdRes = await request(`/api/v1/products/${createdProduct.id}/prices`);
    assert(pricesProdRes.statusCode === 200, 'GET /products/:id/prices returned 200');

    const statsProdRes = await request(`/api/v1/products/${createdProduct.id}/statistics`);
    assert(statsProdRes.statusCode === 200, 'GET /products/:id/statistics returned 200');
    console.log('');

    // ──── 5. Pipeline API ────
    console.log('── 5. Pipeline API ──');
    const pipelineRes = await request('/api/v1/pipeline/run', {
      method: 'POST',
      body: { url: 'https://www.amazon.in/dp/B08N5WRWNW' },
    });
    assert(pipelineRes.statusCode === 200, 'POST /pipeline/run returned 200');
    assert(pipelineRes.body.data.executionId, 'Pipeline execution ID returned');
    assert(pipelineRes.body.data.stages.length >= 6, 'Pipeline executed 6 stages');

    // Validation error test
    const badPipelineRes = await request('/api/v1/pipeline/run', {
      method: 'POST',
      body: { url: 'https://invalid-domain.com' },
    });
    assert(badPipelineRes.statusCode === 400, 'POST /pipeline/run with invalid URL returned 400 Bad Request');
    console.log('');

    // ──── 6. Monitoring APIs ────
    console.log('── 6. Monitoring APIs ──');
    const runMonRes = await request('/api/v1/monitoring/run', { method: 'POST' });
    assert(runMonRes.statusCode === 200, 'POST /monitoring/run returned 200');

    const pauseMonRes = await request('/api/v1/monitoring/pause', { method: 'POST' });
    assert(pauseMonRes.statusCode === 200, 'POST /monitoring/pause returned 200');

    const resumeMonRes = await request('/api/v1/monitoring/resume', { method: 'POST' });
    assert(resumeMonRes.statusCode === 200, 'POST /monitoring/resume returned 200');

    const retryMonRes = await request('/api/v1/monitoring/retry', { method: 'POST' });
    assert(retryMonRes.statusCode === 200, 'POST /monitoring/retry returned 200');

    const jobsMonRes = await request('/api/v1/monitoring/jobs');
    assert(jobsMonRes.statusCode === 200, 'GET /monitoring/jobs returned 200');

    const historyMonRes = await request('/api/v1/monitoring/history');
    assert(historyMonRes.statusCode === 200, 'GET /monitoring/history returned 200');
    console.log('');

    // ──── 7. Deal APIs ────
    console.log('── 7. Deal APIs ──');
    const listDealsRes = await request('/api/v1/deals');
    assert(listDealsRes.statusCode === 200, 'GET /deals returned 200');

    const detectDealRes = await request(`/api/v1/deals/${createdProduct.id}/detect`, { method: 'POST' });
    assert(detectDealRes.statusCode === 200, 'POST /deals/:id/detect returned 200');

    const approveDealRes = await request(`/api/v1/deals/${createdProduct.id}/approve`, { method: 'POST' });
    assert(approveDealRes.statusCode === 200, 'POST /deals/:id/approve returned 200');

    const rejectDealRes = await request(`/api/v1/deals/${createdProduct.id}/reject`, {
      method: 'POST',
      body: { reason: 'Price drop too small' },
    });
    assert(rejectDealRes.statusCode === 200, 'POST /deals/:id/reject returned 200');

    const replayDealRes = await request(`/api/v1/deals/${createdProduct.id}/replay`, { method: 'POST' });
    assert(replayDealRes.statusCode === 200, 'POST /deals/:id/replay returned 200');
    console.log('');

    // ──── 8. Affiliate APIs ────
    console.log('── 8. Affiliate APIs ──');
    const genAffRes = await request('/api/v1/affiliate/generate', {
      method: 'POST',
      body: { url: 'https://www.amazon.in/dp/B08N5WRWNW', merchant: 'amazon' },
    });
    assert(genAffRes.statusCode === 200, 'POST /affiliate/generate returned 200');
    assert(genAffRes.body.data.shortUrl, 'Short affiliate URL generated');

    const provAffRes = await request('/api/v1/affiliate/providers');
    assert(provAffRes.statusCode === 200, 'GET /affiliate/providers returned 200');

    const statusAffRes = await request('/api/v1/affiliate/status');
    assert(statusAffRes.statusCode === 200, 'GET /affiliate/status returned 200');
    console.log('');

    // ──── 9. Publishing APIs ────
    console.log('── 9. Publishing APIs ──');
    const prepPubRes = await request('/api/v1/publishing/prepare', {
      method: 'POST',
      body: { productId: createdProduct.id },
    });
    assert(prepPubRes.statusCode === 200, 'POST /publishing/prepare returned 200');

    const prevPubRes = await request('/api/v1/publishing/preview', {
      method: 'POST',
      body: { productId: createdProduct.id },
    });
    assert(prevPubRes.statusCode === 200, 'POST /publishing/preview returned 200');

    const pubRes = await request('/api/v1/publishing/publish', {
      method: 'POST',
      body: { packageId: 'pkg_test_123' },
    });
    assert(pubRes.statusCode === 200, 'POST /publishing/publish returned 200');

    const retryPubRes = await request('/api/v1/publishing/retry', {
      method: 'POST',
      body: { packageId: 'pkg_test_123' },
    });
    assert(retryPubRes.statusCode === 200, 'POST /publishing/retry returned 200');

    const rollbackPubRes = await request('/api/v1/publishing/rollback', {
      method: 'POST',
      body: { messageId: 101 },
    });
    assert(rollbackPubRes.statusCode === 200, 'POST /publishing/rollback returned 200');

    const historyPubRes = await request('/api/v1/publishing/history');
    assert(historyPubRes.statusCode === 200, 'GET /publishing/history returned 200');
    console.log('');

    // ──── 10. Telegram APIs ────
    console.log('── 10. Telegram APIs ──');
    const testTgRes = await request('/api/v1/telegram/test', {
      method: 'POST',
      body: { text: 'Test message' },
    });
    assert(testTgRes.statusCode === 200, 'POST /telegram/test returned 200');

    const dryRunTgRes = await request('/api/v1/telegram/dry-run', {
      method: 'POST',
      body: { text: 'Dry run message' },
    });
    assert(dryRunTgRes.statusCode === 200, 'POST /telegram/dry-run returned 200');

    const channelsTgRes = await request('/api/v1/telegram/channels');
    assert(channelsTgRes.statusCode === 200, 'GET /telegram/channels returned 200');

    const historyTgRes = await request('/api/v1/telegram/history');
    assert(historyTgRes.statusCode === 200, 'GET /telegram/history returned 200');
    console.log('');

    // ──── 11. Swagger & OpenAPI APIs ────
    console.log('── 11. Swagger & OpenAPI APIs ──');
    const swaggerHtmlRes = await request('/api/v1/docs');
    assert(swaggerHtmlRes.statusCode === 200, 'GET /api/v1/docs (Swagger UI) returned 200');

    const openapiJsonRes = await request('/api/v1/docs/openapi.json');
    assert(openapiJsonRes.statusCode === 200, 'GET /api/v1/docs/openapi.json returned 200');
    assert(openapiJsonRes.body.openapi === '3.0.0', 'OpenAPI version is 3.0.0');
    console.log('');

    // ──── Summary ────
    console.log('═══════════════════════════════════════════════════════════');
    if (process.exitCode === 1) {
      console.log('  ❌ SOME TESTS FAILED — see output above');
    } else {
      console.log('  ✅ ALL PHASE 16 INTEGRATION TESTS PASSED');
    }
    console.log('═══════════════════════════════════════════════════════════');

  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exitCode = 1;
  if (server) server.close();
});
