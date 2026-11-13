import { useEffect, useRef } from "react";

// Chama a função de atualizar a cada intervalo (padrão: 60 segundos).
export function useAutoRefresh(atualizar: () => void, intervaloMs = 60000) {
  const ultima = useRef(atualizar);
  ultima.current = atualizar;

  useEffect(() => {
    const id = setInterval(() => ultima.current(), intervaloMs);
    return () => clearInterval(id);
  }, [intervaloMs]);
}