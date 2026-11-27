"""Regression tests for the cross-product Make and HTTP contract checks."""

import json
import subprocess
import sys
import tempfile
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from threading import Thread

from tools.check_http_contract import check
from tools.check_make_contract import COMMON, PROFILES

ROOT = Path(__file__).resolve().parents[1]


class MakeContractTests(unittest.TestCase):
    def test_restore_targets_require_recipes_and_accepted_aliases_are_not_run(self):
        regular = sorted(set((COMMON + " " + PROFILES["backend"]).split()) - {"db-restore", "verify-restore"})
        with tempfile.TemporaryDirectory() as tmp:
            makefile = Path(tmp) / "Makefile"
            makefile.write_text(" ".join(regular) + ":\n\tfalse\n.PHONY: db-restore verify-restore\n")
            command = [sys.executable, str(ROOT / "tools/check_make_contract.py"), "backend", tmp]
            missing = subprocess.run(command, capture_output=True, text=True)
            self.assertNotEqual(missing.returncode, 0)
            self.assertIn("missing Make targets: db-restore, verify-restore", missing.stderr)
            with makefile.open("a") as out:
                out.write("db-restore: isolated-recovery\nverify-restore: verify\nisolated-recovery verify:\n\tfalse\n")
            subprocess.run(command, check=True, capture_output=True)


class HTTPContractTests(unittest.TestCase):
    def setUp(self):
        self.responses = {
            ("/livez", None): (200, "ok"),
            ("/readyz", None): (200, "ready"),
            ("/v1/me", None): (401, '{"code":"UNAUTHORIZED","message":"unauthorized"}'),
            ("/v1/profile", None): (401, '{"code":"UNAUTHORIZED","message":"unauthorized"}'),
            ("/openapi.yaml", None): (200, 'openapi: "3.0.3"\npaths: {}\n'),
        }
        responses = self.responses

        class Fixture(BaseHTTPRequestHandler):
            def do_GET(self):
                status, body = responses.get((self.path, self.headers.get("X-Maat-Error-Format")), (404, ""))
                self.send_response(status)
                self.end_headers()
                self.wfile.write(body.encode("utf-8"))

            def log_message(self, *args):
                pass

        server = HTTPServer(("127.0.0.1", 0), Fixture)
        thread = Thread(target=server.serve_forever, kwargs={"poll_interval": 0.05})
        thread.start()
        self.addCleanup(server.server_close)
        self.addCleanup(thread.join)
        self.addCleanup(server.shutdown)
        self.url = f"http://127.0.0.1:{server.server_port}"

    def test_all_products_and_isolated_database_outage(self):
        check("seshat", self.url, 200)
        check("khnum", self.url, 200)
        self.responses[("/v1/me", "1")] = self.responses[("/v1/me", None)]
        self.responses[("/v1/me", None)] = (401, '{"code":401,"message":"unauthorized"}')
        self.responses[("/readyz", None)] = (503, "unavailable")
        check("thoth", self.url, 503)
        with self.assertRaisesRegex(ValueError, "expected 200, received 503"):
            check("thoth", self.url, 200)

    def test_rejects_only_legacy_response_and_outdated_document(self):
        self.responses[("/v1/me", "1")] = self.responses[("/v1/me", None)] = (401, '{"code":401}')
        with self.assertRaisesRegex(ValueError, "string error code and message"):
            check("thoth", self.url, 200)
        self.responses[("/openapi.yaml", None)] = (200, json.dumps({"swagger": "2.0"}))
        with self.assertRaisesRegex(ValueError, "OpenAPI 3"):
            check("khnum", self.url, 200)
