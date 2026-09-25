function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitTextByMatch(text, query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [{ text, isMatch: false }];
  }

  const pattern = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi");
  const parts = text.split(pattern);

  return parts
    .filter((part) => part !== "")
    .map((part) => ({
      text: part,
      isMatch: part.toLowerCase() === normalizedQuery.toLowerCase(),
    }));
}