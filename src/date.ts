export function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.startsWith("0000-00-00")) {
    return null;
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}
