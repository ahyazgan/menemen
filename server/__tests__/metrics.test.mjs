import test from 'node:test';
import assert from 'node:assert/strict';

import { toPrometheus } from '../metrics.mjs';

test('boş metrikler temel satırları üretir', () => {
  const out = toPrometheus({ total: 0, byStatus: {}, byRoute: {} });
  assert.match(out, /# TYPE lezzet_proxy_requests_total counter/);
  assert.match(out, /lezzet_proxy_requests_total 0/);
  assert.ok(out.endsWith('\n'));
});

test('durum ve rota etiketleri yazılır', () => {
  const out = toPrometheus({
    total: 11,
    byStatus: { '2xx': 3, '4xx': 8 },
    byRoute: { '/deepgram': 3, auth: 4 },
  });
  assert.match(out, /lezzet_proxy_requests_total 11/);
  assert.match(out, /lezzet_proxy_requests_status_total\{class="2xx"\} 3/);
  assert.match(out, /lezzet_proxy_requests_status_total\{class="4xx"\} 8/);
  assert.match(out, /lezzet_proxy_route_requests_total\{route="\/deepgram"\} 3/);
});

test('etiket değerindeki tırnak kaçışlanır', () => {
  const out = toPrometheus({ total: 1, byStatus: {}, byRoute: { 'a"b': 1 } });
  assert.match(out, /route="a\\"b"/);
});
