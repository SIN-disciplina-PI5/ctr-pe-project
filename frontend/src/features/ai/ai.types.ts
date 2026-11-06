// Formato da resposta do backend em POST /ai/query.
export type AssistenteResposta =
  | {
      status: "answered";
      mode: "single" | "plan";
      answer: string;
    }
  | {
      status: "refused";
      reason: string;
    };