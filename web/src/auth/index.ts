import type { AuthProvider } from "./provider";
import { TestModeAuthProvider } from "./test-mode-provider";

export type { AuthProvider, AuthUser } from "./provider";
export { TestModeAuthProvider } from "./test-mode-provider";

let provider: AuthProvider | null = null;

/** Active auth provider; the factory is the seam for a real one later. */
export function getAuthProvider(): AuthProvider {
  if (!provider) provider = new TestModeAuthProvider();
  return provider;
}
