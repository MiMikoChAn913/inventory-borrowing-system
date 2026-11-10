#!/usr/bin/env python3
import http.cookiejar
import json
import os
import sys
import urllib.error
import urllib.request


def fetch(opener, url, path, method="GET", payload=None):
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"{url.rstrip('/')}{path}",
        data=data,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    with opener.open(request, timeout=20) as response:
        body = response.read().decode("utf-8")
        return response.status, json.loads(body) if body else None


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: smoke_test.py SERVICE_URL")
    url = sys.argv[1]
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar())
    )

    status, health = fetch(opener, url, "/api/health")
    assert status == 200 and health["status"] == "ok"
    status, ready = fetch(opener, url, "/api/ready")
    assert status == 200 and ready["db"] == "connected"

    with opener.open(url, timeout=20) as response:
        html = response.read().decode("utf-8")
        assert response.status == 200 and "BorrowBox" in html

    email = os.environ.get("SMOKE_EMAIL")
    password = os.environ.get("SMOKE_PASSWORD")
    if bool(email) != bool(password):
        raise RuntimeError("Set both SMOKE_EMAIL and SMOKE_PASSWORD, or neither.")
    if email and password:
        status, login = fetch(
            opener, url, "/api/auth/login", "POST", {"email": email, "password": password}
        )
        assert status == 200 and login["user"]["email"] == email.lower()
        status, items = fetch(opener, url, "/api/items")
        assert status == 200 and isinstance(items["items"], list)
        fetch(opener, url, "/api/auth/logout", "POST")
        print("PASS login and authenticated inventory read")
    else:
        print("SKIP login: smoke credentials are not configured")

    print("PASS health, readiness/database, and HTML")


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, urllib.error.URLError, KeyError) as error:
        print(f"FAIL smoke test: {error}", file=sys.stderr)
        raise SystemExit(1)
