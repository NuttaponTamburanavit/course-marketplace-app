export function formatSatang(satang: number): string {
  const baht = satang / 100;
  return `฿${baht.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
