/** Trim + lowercase for логіну та відновлення паролю (узгоджено з API). */
export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}
