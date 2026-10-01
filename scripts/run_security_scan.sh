#!/usr/bin/env bash
set -e
OUTPUT_DIR="doc/output/security"
mkdir -p "$OUTPUT_DIR"
echo "=== Iniciando varredura OWASP ZAP contra a API CTR-PE (porta 3333) ==="
docker run --rm --network="host" -v "$(pwd)/$OUTPUT_DIR:/zap/wrk/:rw" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://localhost:3333/health -r zap_report.html -J zap_report.json || true
echo "=== Varredura concluída ==="
echo "Relatório gerado em: $OUTPUT_DIR/zap_report.html"
