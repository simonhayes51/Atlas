import Anthropic from "@anthropic-ai/sdk";

// Model is configurable so a buyer can tune cost/quality in one place.
const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5";

const SYSTEM_PROMPT = `You write replies to customer reviews on behalf of business owners. The reply will be posted publicly under the review (on Google, Yelp, Trustpilot, TripAdvisor, or similar).

Rules:
- Write in the same language as the review.
- Sound like a real human business owner, not a corporation. No corporate boilerplate.
- Keep it to 2-5 sentences. Short reviews get short replies.
- For positive reviews: thank them specifically for what they praised, invite them back.
- For negative reviews: acknowledge the specific complaint, never argue or make excuses, offer to make it right, and where sensible invite them to continue the conversation privately.
- Never invent facts, compensation offers, policies, or events that were not provided.
- Never include placeholder text like [name] or [your business].
- Output ONLY the reply text - no preamble, no quotes around it, no signature unless one was requested.`;

export async function generateReviewReply(opts: {
  review: string;
  businessName: string;
  tone: string;
  context?: string;
}): Promise<string> {
  const client = new Anthropic();

  const userMessage = [
    `Business name: ${opts.businessName}`,
    `Desired tone: ${opts.tone}`,
    opts.context ? `Extra context from the owner: ${opts.context}` : null,
    ``,
    `Customer review:`,
    opts.review,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    // Low effort keeps latency and cost down; replies are short and simple.
    output_config: { effort: "low" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("The AI declined to respond to this review. Try rewording it.");
  }

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) {
    throw new Error("No reply was generated. Please try again.");
  }
  return text;
}
