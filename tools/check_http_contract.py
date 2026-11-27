"""Read-only HTTP smoke test for the Maat family contract. Uses only the Python standard library."""

import argparse
import http.client
import json
import re
import sys
from urllib.parse import urlsplit


PROFILE_PATH = {"thoth": "/v1/me", "seshat": "/v1/me", "khnum": "/v1/profile"}


def check(product, base_url, ready_status):
    url = urlsplit(base_url)
    if (url.scheme not in ("https", "http") or not url.hostname or url.username is not None
            or url.password is not None or url.query or url.fragment):
        raise ValueError("supply the API base URL without credentials, query or fragment")

    def get(path, status, headers=None):
        transport = http.client.HTTPSConnection if url.scheme == "https" else http.client.HTTPConnection
        conn = transport(url.hostname, url.port, timeout=10)
        try:
            conn.request("GET", url.path.rstrip("/") + path, headers=headers or {})
            response = conn.getresponse()
            if response.status != status:
                raise ValueError(f"GET {path}: expected {status}, received {response.status}")
            return response.read()
        finally:
            conn.close()

    get("/livez", 200)
    get("/readyz", ready_status)
    path = PROFILE_PATH[product]
    if product == "thoth":
        legacy = json.loads(get(path, 401))
        if not isinstance(legacy, dict) or legacy.get("code") != 401:
            raise ValueError("expected Thoth legacy error with numeric code 401")
    headers = {"X-Maat-Error-Format": "1"} if product == "thoth" else {}
    error = json.loads(get(path, 401, headers))
    if not isinstance(error, dict) or not all(
        isinstance(error.get(k), str) and error[k].strip() for k in ("code", "message")
    ):
        raise ValueError(f"GET {path}: expected string error code and message")
    # A connectivity/version check. Each producer validates its full specification in CI.
    document = get("/openapi.yaml", 200).decode("utf-8")
    if document.lstrip().startswith("{"):
        spec = json.loads(document)
        version = spec.get("openapi") if isinstance(spec, dict) else None
    else:
        match = re.search(r"""^openapi:\s*['"]?(3\.[0-9]+\.[0-9]+)['"]?\s*$""", document, re.MULTILINE)
        version = match.group(1) if match else None
    if not isinstance(version, str) or not re.fullmatch(r"3\.[0-9]+\.[0-9]+", version):
        raise ValueError("GET /openapi.yaml: expected an OpenAPI 3 document")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("product", choices=PROFILE_PATH)
    parser.add_argument("api_url")
    parser.add_argument("--expect-ready", type=int, choices=(200, 503), default=200)
    args = parser.parse_args()
    try:
        check(args.product, args.api_url, args.expect_ready)
    except (OSError, ValueError, http.client.HTTPException) as exc:
        sys.exit(f"{args.product}: {exc}")
    print(f"{args.product}: HTTP contract OK (readiness {args.expect_ready})")


if __name__ == "__main__":
    main()
