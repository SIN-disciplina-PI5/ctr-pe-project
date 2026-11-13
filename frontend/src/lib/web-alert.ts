import { Alert, Platform } from "react-native";

import { notify } from "@/store/toast-store";

const TITULOS_DE_ERRO = /erro|atenção|atencao|aviso|falha/i;

/**
 * No navegador o Alert.alert do React Native não faz nada, então confirmações
 * (ex.: "Inativar") e mensagens de sucesso/erro nunca apareciam na versão web.
 * Aqui substituímos por window.confirm (com botões) e por um toast (sem botões).
 * No celular continua valendo o Alert nativo.
 */
export function installWebAlert() {
  if (Platform.OS !== "web") return;

  Alert.alert = (title, message, buttons) => {
    const botoes = buttons ?? [];

    if (botoes.length > 1) {
      const texto = [title, message].filter(Boolean).join("\n\n");
      const confirmou = window.confirm(texto);
      const cancelar = botoes.find((b) => b.style === "cancel");
      const confirmar = [...botoes].reverse().find((b) => b.style !== "cancel");
      (confirmou ? confirmar : cancelar)?.onPress?.();
      return;
    }

    if (TITULOS_DE_ERRO.test(title)) {
      notify.error(title, message);
    } else {
      notify.success(title, message);
    }
    botoes[0]?.onPress?.();
  };
}
