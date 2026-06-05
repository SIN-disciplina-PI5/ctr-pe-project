export function formatDateToBR(date: string | Date): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return "Data inválida";
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}