export function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  );
}

export function getFilenameFromContentDisposition(contentDisposition) {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(
    /filename\*=(?:UTF-8''|utf-8'')([^;]+)/,
  );
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/^"|"$/g, ''));
    } catch {
      return utf8Match[1].trim().replace(/^"|"$/g, '');
    }
  }

  const asciiMatch = contentDisposition.match(/filename=([^;]+)/);
  if (asciiMatch?.[1]) return asciiMatch[1].trim().replace(/^"|"$/g, '');

  return null;
}
