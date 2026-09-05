/** Minimal className helper (shadcn-style `cn` without extra deps). */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}
