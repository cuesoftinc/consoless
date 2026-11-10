import type { Me } from "../types";
import { http } from "./client";

/** The signed-in user. */
export const meRepo = {
  get(): Promise<Me> {
    return http.get<Me>("/me");
  },
  rename(displayName: string): Promise<Me> {
    return http.patch<Me>("/me", { display_name: displayName });
  },
  /** Records the one-time 16-or-older attestation (S-15). */
  attest(): Promise<Me> {
    return http.post<Me>("/me/attestation");
  },
  /** Deletes the account and everything it owns (CON-014). */
  remove(): Promise<void> {
    return http.delete("/me");
  },
};
