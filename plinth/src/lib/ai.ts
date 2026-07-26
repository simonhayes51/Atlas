import Anthropic from "@anthropic-ai/sdk";

// Real, non-mocked AI headline assist. Calls the Anthropic API directly with
// the signed-in user's own key (stored per-account) — Plinth never ships a
// shared key, so there's nothing to rate-limit or meter server-side.

export type HeadlinePair = { headline: string; subheadline: string };

const SCHEMA = {
  type: "object" as const,
  properties: {
    options: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          headline: { type: "string" },
          subheadline: { type: "string" },
        },
        required: ["headline", "subheadline"],
        additionalProperties: false,
      },
    },
  },
  required: ["options"],
  additionalProperties: false,
};

export class HeadlineAssistError extends Error {}

export async function generateHeadlines(params: {
  apiKey: string;
  appName: string;
  appDescription: string;
  tone: string;
}): Promise<HeadlinePair[]> {
  const client = new Anthropic({ apiKey: params.apiKey, timeout: 30_000 });

  const prompt = `App name: ${params.appName}
One-line description: ${params.appDescription}
Tone: ${params.tone}

Write 3 distinct headline + subheadline pairs for an app store screenshot. The
headline is the large marketing hook shown over the screenshot (max 6 words).
The subheadline is a short supporting line (max 10 words). Make each of the 3
options a genuinely different angle (e.g. benefit-led, feature-led, social
proof / outcome-led) — do not just reword the same sentence three times.`;

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-opus-5",
        max_tokens: 1024,
        output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content.find((b) => b.type === "text");
      if (!text || text.type !== "text") {
        throw new HeadlineAssistError("Claude returned no text output.");
      }
      const parsed = JSON.parse(text.text) as { options: HeadlinePair[] };
      if (!parsed.options?.length) {
        throw new HeadlineAssistError("Claude returned an empty result.");
      }
      return parsed.options;
    } catch (err) {
      lastError = err;
      if (err instanceof Anthropic.AuthenticationError) {
        throw new HeadlineAssistError(
          "That Anthropic API key was rejected. Check it in Settings and try again."
        );
      }
      if (err instanceof Anthropic.RateLimitError && attempt < 2) {
        await new Promise((r) => setTimeout(r, 800 * 2 ** attempt));
        continue;
      }
      if (err instanceof Anthropic.APIError && (err.status ?? 0) >= 500 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 800 * 2 ** attempt));
        continue;
      }
      break;
    }
  }

  if (lastError instanceof HeadlineAssistError) throw lastError;
  if (lastError instanceof Anthropic.APIError) {
    throw new HeadlineAssistError(`Claude API error: ${lastError.message}`);
  }
  throw new HeadlineAssistError("Couldn't reach Claude. Check your connection and try again.");
}
