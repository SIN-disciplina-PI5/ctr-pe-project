import { useMutation } from "@tanstack/react-query";

import * as service from "./assistente.service";

export function useSendChatMessage() {
  return useMutation({
    mutationFn: service.sendChatMessage,
  });
}
