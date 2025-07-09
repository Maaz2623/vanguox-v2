export function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "??";

  const trimmed = name.trim();
  if (!trimmed) return "??";

  const parts = trimmed.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1) {
    const word = parts[0];
    if (word.length >= 2) {
      return word.slice(0, 2).toUpperCase(); // e.g. "Al"
    } else {
      return word[0].toUpperCase(); // just 1 letter
    }
  }

  // Fallback: extract any 1–2 letters from the name string
  const letters = [...trimmed.replace(/[^a-zA-Z]/g, "")];
  if (letters.length >= 2) return (letters[0] + letters[1]).toUpperCase();
  if (letters.length === 1) return letters[0].toUpperCase();

  return "??";
}
