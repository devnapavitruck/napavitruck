export function normalizeRut(rut: string): string {
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
}
export function formatRut(rut: string): string {
  const n = normalizeRut(rut);
  const body = n.slice(0, -1);
  const dv = n.slice(-1);
  return `${Number(body).toLocaleString('es-CL')}-${dv}`;
}
// (Opcional: agrega verificador mod11 si lo necesitas ahora)
