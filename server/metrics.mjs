/**
 * Prometheus metin formatı üretici (saf, testlenebilir). Bellekteki sayaçları
 * scrape edilebilir metne çevirir.
 */
function escapeLabel(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function toPrometheus(metrics) {
  const lines = [];

  lines.push('# HELP lezzet_proxy_requests_total Toplam proxy isteği');
  lines.push('# TYPE lezzet_proxy_requests_total counter');
  lines.push(`lezzet_proxy_requests_total ${metrics.total ?? 0}`);

  lines.push('# HELP lezzet_proxy_requests_status_total Durum sınıfına göre istek');
  lines.push('# TYPE lezzet_proxy_requests_status_total counter');
  for (const [klass, count] of Object.entries(metrics.byStatus ?? {})) {
    lines.push(`lezzet_proxy_requests_status_total{class="${escapeLabel(klass)}"} ${count}`);
  }

  lines.push('# HELP lezzet_proxy_route_requests_total Rotaya göre istek');
  lines.push('# TYPE lezzet_proxy_route_requests_total counter');
  for (const [route, count] of Object.entries(metrics.byRoute ?? {})) {
    lines.push(`lezzet_proxy_route_requests_total{route="${escapeLabel(route)}"} ${count}`);
  }

  return lines.join('\n') + '\n';
}
