import { useMutation } from "@tanstack/react-query";

import { signIn } from "./auth.service";

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
  });
}
