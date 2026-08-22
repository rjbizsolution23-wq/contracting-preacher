#!/usr/bin/env python3
"""
One-time (idempotent) setup script: creates every GHL custom field + tag
needed to fully mirror the data collected by The Contracting Preacher's
site forms (contact, booking, newsletter, intake, command-center master
intake) and CRM (D1 leads / business_profiles tables).

Usage:
  GHL_PIT=pit-xxxx GHL_LOCATION_ID=xxxx python3 scripts/ghl_setup_fields.py

Safe to re-run: skips any field/tag whose name already exists in GHL.
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error

PIT = os.environ.get("GHL_PIT", "").strip()
LOCATION_ID = os.environ.get("GHL_LOCATION_ID", "").strip()
BASE = "https://services.leadconnectorhq.com"
VERSION = "2021-07-28"

if not PIT or not LOCATION_ID:
    print("ERROR: set GHL_PIT and GHL_LOCATION_ID env vars", file=sys.stderr)
    sys.exit(1)


def req(method, path, body=None):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("Authorization", f"Bearer {PIT}")
    r.add_header("Version", VERSION)
    r.add_header("Accept", "application/json")
    r.add_header("User-Agent", "curl/8.5.0")
    if data is not None:
        r.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        try:
            payload = json.loads(e.read().decode())
        except Exception:
            payload = {"error": str(e)}
        return e.code, payload


# ─────────────────────────────────────────────────────────────────────────
# 1. Custom field definitions
#    (name, dataType, options-or-None)
# ─────────────────────────────────────────────────────────────────────────
FIELDS = [
    # --- Contact form (functions/api/contact.ts) ---
    ("Company", "TEXT", None),
    # NOTE: "Website" is intentionally omitted — GHL ships a standard
    # contact.website field already; creating a duplicate custom field
    # errors out ("conflict with existing Standard Field").
    ("Service Interested In", "SINGLE_OPTIONS", [
        "SAM.gov Registration & Renewal",
        "Bid & Proposal Writing",
        "8(a) Certification",
        "HUBZone Certification",
        "WOSB Certification",
        "SDVOSB Certification",
        "Other / Not Sure",
        "General Consultation / Not Sure",
    ]),
    ("Inquiry Message", "LARGE_TEXT", None),
    ("Lead Source", "TEXT", None),
    ("UTM Source", "TEXT", None),
    ("UTM Medium", "TEXT", None),
    ("UTM Campaign", "TEXT", None),
    ("Referrer URL", "TEXT", None),

    # --- Booking (functions/api/booking.ts) ---
    ("Booking Requested Date", "DATE", None),
    ("Booking Requested Time", "TEXT", None),
    ("Booking Notes", "LARGE_TEXT", None),
    ("Booking Status", "SINGLE_OPTIONS", ["pending", "confirmed", "completed", "cancelled", "no-show"]),

    # --- Intake / CRM leads (functions/api/crm/leads.ts, db/0001+0003) ---
    ("Industry", "TEXT", None),
    ("Employees", "TEXT", None),
    ("Annual Revenue", "TEXT", None),
    ("NAICS Codes", "TEXT", None),
    ("SAM.gov Status", "SINGLE_OPTIONS", ["unknown", "not-started", "in-progress", "active", "expired"]),
    ("Certifications", "TEXT", None),
    ("Services Needed", "LARGE_TEXT", None),
    ("Goals / Deadlines / Contract Targets", "LARGE_TEXT", None),
    ("Readiness Score", "NUMERICAL", None),
    ("Pipeline Stage", "SINGLE_OPTIONS", ["new-intake", "readiness-review", "in-progress", "won", "lost"]),
    ("Strengths", "LARGE_TEXT", None),
    ("Risk Flags", "LARGE_TEXT", None),
    ("Score Explanation", "LARGE_TEXT", None),
    ("Consent - Email Updates", "CHECKBOX", ["Yes"]),
    ("Consent - SMS/Text Messages", "CHECKBOX", ["Yes"]),

    # --- Command Center Master Business Profile (business_profiles table) ---
    ("Legal Business Name", "TEXT", None),
    ("DBA / Brand Name", "TEXT", None),
    ("Entity Type", "TEXT", None),
    ("State of Formation", "TEXT", None),
    ("Formation Date", "DATE", None),
    ("Principal Business Address", "TEXT", None),
    ("Service Area", "TEXT", None),
    ("Profit Status", "SINGLE_OPTIONS", ["for-profit", "nonprofit"]),
    ("UEI Number", "TEXT", None),
    ("CAGE Code", "TEXT", None),
    ("SC Vendor Number", "TEXT", None),
    ("Grants.gov Status", "SINGLE_OPTIONS", ["unknown", "not-started", "in-progress", "active"]),
    ("Primary NAICS", "TEXT", None),
    ("Secondary NAICS", "TEXT", None),
    ("Core Offering", "LARGE_TEXT", None),
    ("Contractors (1099)", "TEXT", None),
    ("Business Licenses", "TEXT", None),
    ("Revenue 2023", "TEXT", None),
    ("Revenue 2024", "TEXT", None),
    ("Revenue 2025", "TEXT", None),
    ("Funding Amount Requested", "TEXT", None),
    ("Use of Funds", "LARGE_TEXT", None),
    ("Lanes of Interest", "MULTIPLE_OPTIONS", [
        "Federal contracts", "South Carolina contracts", "County/city contracts", "Grants",
        "SBIR/STTR", "Loans", "Investors", "Accelerators", "Sponsors",
        "Prime contractor partners", "Corporate supplier programs",
    ]),
    ("Top Past Projects", "LARGE_TEXT", None),
    ("Biggest Goal", "LARGE_TEXT", None),
    ("Biggest Gap", "LARGE_TEXT", None),

    # --- Newsletter (functions/api/newsletter.ts) ---
    ("Newsletter Subscriber", "CHECKBOX", ["Yes"]),
    ("Newsletter Source", "TEXT", None),
]

# ─────────────────────────────────────────────────────────────────────────
# 2. Tags (in addition to the 3 that already exist:
#    follow-up, high priority, warm lead)
# ─────────────────────────────────────────────────────────────────────────
TAGS = [
    "contact-form",
    "booking-request",
    "newsletter-subscriber",
    "master-intake",
    "command-center-intake",
    "sam-active",
    "sam-not-started",
    "certification-interested",
    "8a-interest",
    "hubzone-interest",
    "wosb-interest",
    "sdvosb-interest",
    "consent-email-yes",
    "consent-sms-yes",
    "consent-sms-no",
    "readiness-high",
    "readiness-low",
    "south-carolina",
    "federal-contracts-lane",
    "grants-lane",
]


def main():
    print(f"Target location: {LOCATION_ID}\n")

    # ---- Existing state ----
    status, existing_fields_resp = req("GET", f"/locations/{LOCATION_ID}/customFields")
    if status != 200:
        print(f"FATAL: could not list existing custom fields ({status}): {existing_fields_resp}")
        sys.exit(1)
    existing_field_names = {f["name"] for f in existing_fields_resp.get("customFields", [])}

    status, existing_tags_resp = req("GET", f"/locations/{LOCATION_ID}/tags")
    if status != 200:
        print(f"FATAL: could not list existing tags ({status}): {existing_tags_resp}")
        sys.exit(1)
    existing_tag_names = {t["name"].lower() for t in existing_tags_resp.get("tags", [])}

    print(f"Existing custom fields: {len(existing_field_names)}")
    print(f"Existing tags: {len(existing_tag_names)} -> {sorted(existing_tag_names)}\n")

    # ---- Create fields ----
    created_fields, skipped_fields, failed_fields = [], [], []
    for name, dtype, options in FIELDS:
        if name in existing_field_names:
            skipped_fields.append(name)
            continue
        body = {"name": name, "dataType": dtype, "model": "contact"}
        if options:
            body["options"] = options
        status, resp = req("POST", f"/locations/{LOCATION_ID}/customFields", body)
        if status == 201:
            fk = resp.get("customField", {}).get("fieldKey", "?")
            created_fields.append((name, dtype, fk))
            print(f"  [OK]   {name}  ({dtype})  -> {fk}")
        else:
            failed_fields.append((name, status, resp))
            print(f"  [FAIL] {name}  status={status}  {resp}")
        time.sleep(0.25)  # be polite to rate limits

    # ---- Create tags ----
    created_tags, skipped_tags, failed_tags = [], [], []
    for tag in TAGS:
        if tag.lower() in existing_tag_names:
            skipped_tags.append(tag)
            continue
        status, resp = req("POST", f"/locations/{LOCATION_ID}/tags", {"name": tag})
        if status in (200, 201):
            created_tags.append(tag)
            print(f"  [OK]   tag: {tag}")
        else:
            failed_tags.append((tag, status, resp))
            print(f"  [FAIL] tag: {tag}  status={status}  {resp}")
        time.sleep(0.25)

    # ---- Summary ----
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Custom fields created: {len(created_fields)}")
    print(f"Custom fields skipped (already existed): {len(skipped_fields)}")
    print(f"Custom fields FAILED: {len(failed_fields)}")
    print(f"Tags created: {len(created_tags)}")
    print(f"Tags skipped (already existed): {len(skipped_tags)}")
    print(f"Tags FAILED: {len(failed_tags)}")

    if failed_fields or failed_tags:
        print("\n--- FAILURES ---")
        for name, status, resp in failed_fields:
            print(f"FIELD {name}: {status} {resp}")
        for tag, status, resp in failed_tags:
            print(f"TAG {tag}: {status} {resp}")
        sys.exit(2)

    # dump field-key mapping for reference / for wiring the API endpoints later
    mapping = {name: fk for name, _, fk in created_fields}
    with open("/tmp/ghl_field_keys.json", "w") as f:
        json.dump(mapping, f, indent=2)
    print("\nField-key mapping written to /tmp/ghl_field_keys.json")


if __name__ == "__main__":
    main()
