export type Diferenca = {
  campo: string;
  antes: string;
  depois: string;
  mudou: boolean;
};

export function formatarValor(valor: unknown): string {
  if (valor === null || valor === undefined || valor === "") return "—";
  if (typeof valor === "boolean") return valor ? "Sim" : "Não";
  if (typeof valor === "object") return JSON.stringify(valor);
  return String(valor);
}

function comoObjeto(valor: unknown): Record<string, unknown> {
  if (valor && typeof valor === "object" && !Array.isArray(valor)) {
    return valor as Record<string, unknown>;
  }
  return {};
}

/**
 * Compara os dados "antes" e "depois" de um registro de auditoria.
 * Retorna uma linha por campo, marcando quais mudaram.
 * Criação não tem "antes" e exclusão não tem "depois": os campos aparecem como "—".
 */
export function calcularDiferencas(antes: unknown, depois: unknown): Diferenca[] {
  const a = comoObjeto(antes);
  const d = comoObjeto(depois);
  const campos = [...new Set([...Object.keys(a), ...Object.keys(d)])];

  return campos.map((campo) => {
    const textoAntes = formatarValor(a[campo]);
    const textoDepois = formatarValor(d[campo]);
    return {
      campo,
      antes: textoAntes,
      depois: textoDepois,
      mudou: textoAntes !== textoDepois,
    };
  });
}
