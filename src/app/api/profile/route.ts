import { AnswersSchema, createProfile } from "@/lib/profiles";
import type { ProfileAnswers } from "@/lib/types";

// Two AI calls (story + narrative) can take a while on larger models.
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = AnswersSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "invalid_answers", issues: parsed.error.issues.slice(0, 5) }, { status: 400 });
  try {
    const id = await createProfile(parsed.data as ProfileAnswers);
    return Response.json({ id });
  } catch (e) {
    console.error("[profile] create failed", e);
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
