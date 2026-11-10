import { isResponse, jsonOk, requireUser } from "@/mocks/http";

/**
 * POST /me/attestation: records the one-time 16-or-older attestation that
 * creating needs (S-15). Idempotent: a second call keeps the first time.
 */
export async function POST(req: Request) {
  const auth = requireUser(req);
  if (isResponse(auth)) return auth;
  auth.state.me.creator_attested_at ??= new Date().toISOString();
  return jsonOk(auth.state.me);
}
