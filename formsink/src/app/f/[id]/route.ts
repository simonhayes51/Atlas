import { NextResponse, type NextRequest } from "next/server";
import {
  countSubmissionsThisMonth,
  getForm,
  getUserById,
  insertSubmission,
} from "@/lib/db";
import { sendSubmissionEmail } from "@/lib/email";
import { planFor } from "@/lib/plans";
import { siteUrl } from "@/lib/stripe";

// Public submission endpoint: POST /f/:id
// Accepts HTML form posts (urlencoded / multipart) and JSON.
// Reserved fields: _gotcha (honeypot), _next (redirect after submit).

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wantsJson =
    request.headers.get("content-type")?.includes("application/json") ||
    request.headers.get("accept")?.includes("application/json");

  // --- Parse body -----------------------------------------------------------
  let fields: Record<string, string> = {};
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = (await request.json()) as Record<string, unknown>;
      for (const [key, value] of Object.entries(json)) {
        fields[key] = typeof value === "string" ? value : JSON.stringify(value);
      }
    } else {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") fields[key] = value; // file uploads not supported
      }
    }
  } catch {
    return respond(wantsJson, { error: "Could not parse request body" }, 400);
  }

  const honeypot = fields["_gotcha"] ?? "";
  const nextUrl = fields["_next"];
  fields = Object.fromEntries(
    Object.entries(fields).filter(([key]) => !key.startsWith("_"))
  );

  if (Object.keys(fields).length === 0) {
    return respond(wantsJson, { error: "Empty submission" }, 400);
  }

  // --- Look up the form and its owner --------------------------------------
  const form = getForm(id);
  if (!form) {
    return respond(wantsJson, { error: "Form not found" }, 404);
  }

  // Honeypot filled in → drop silently but act like it worked, so bots learn nothing.
  if (honeypot) {
    return success(wantsJson, nextUrl, form.redirect_url);
  }

  // --- Enforce the owner's monthly submission limit -------------------------
  const owner = getUserById(form.user_id);
  const plan = planFor(owner?.plan);

  if (countSubmissionsThisMonth(form.user_id) >= plan.maxSubmissionsPerMonth) {
    if (wantsJson) {
      return respond(true, { error: "Monthly submission limit reached" }, 429);
    }
    return NextResponse.redirect(new URL("/thanks?over=1", siteUrl()), {
      status: 303,
      headers: CORS_HEADERS,
    });
  }

  // --- Store and notify -----------------------------------------------------
  insertSubmission(form.id, fields);

  if (form.notify === 1 && owner?.email) {
    await sendSubmissionEmail({
      to: owner.email,
      formName: form.name,
      formId: form.id,
      data: fields,
    });
  }

  return success(wantsJson, nextUrl, form.redirect_url);
}

function success(
  wantsJson: boolean | undefined,
  nextUrl: string | undefined,
  formRedirect: string | null
) {
  if (wantsJson) {
    return respond(true, { ok: true }, 200);
  }
  const target =
    safeRedirect(nextUrl) ??
    safeRedirect(formRedirect) ??
    new URL("/thanks", siteUrl()).toString();
  return NextResponse.redirect(target, { status: 303, headers: CORS_HEADERS });
}

function safeRedirect(url: string | null | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function respond(wantsJson: boolean | undefined, body: object, status: number) {
  if (wantsJson) {
    return NextResponse.json(body, { status, headers: CORS_HEADERS });
  }
  const message =
    "error" in body ? String((body as { error: string }).error) : "OK";
  return new NextResponse(message, { status, headers: CORS_HEADERS });
}
