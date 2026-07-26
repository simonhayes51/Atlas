import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { planFor } from "@/lib/plans";
import { generateHeadlines, HeadlineAssistError } from "@/lib/ai";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Sign in to use Headline Assist." }, { status: 401 });
  }

  const user = getUserById(session.id);
  if (!user) {
    return NextResponse.json({ error: "Sign in to use Headline Assist." }, { status: 401 });
  }

  const plan = planFor(user.plan);
  if (!plan.aiAssist) {
    return NextResponse.json(
      { error: "Headline Assist is a Pro feature. Upgrade in Account to unlock it." },
      { status: 403 }
    );
  }

  if (!user.anthropic_api_key) {
    return NextResponse.json(
      { error: "Add your Anthropic API key in Account settings to enable Headline Assist." },
      { status: 400 }
    );
  }

  let body: { appName?: string; appDescription?: string; tone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const appName = (body.appName ?? "").trim().slice(0, 80);
  const appDescription = (body.appDescription ?? "").trim().slice(0, 300);
  const tone = (body.tone ?? "confident").trim().slice(0, 40);

  if (!appName || !appDescription) {
    return NextResponse.json(
      { error: "App name and a one-line description are both required." },
      { status: 400 }
    );
  }

  try {
    const options = await generateHeadlines({
      apiKey: user.anthropic_api_key,
      appName,
      appDescription,
      tone,
    });
    return NextResponse.json({ options });
  } catch (err) {
    const message = err instanceof HeadlineAssistError ? err.message : "Headline Assist failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
