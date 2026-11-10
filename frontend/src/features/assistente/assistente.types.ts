export type ChatIntent =
  | "data_question"
  | "report_request"
  | "unclear"
  | "write_request"
  | "out_of_domain";

export type ChatStatus =
  "answered" | "refused" | "report_pending" | "clarification";

export type QueryRow = Record<string, unknown>;

export type QueryResultBlock = {
  id: string;
  purpose?: string;
  sql: string;
  rowsUsed: QueryRow[];
};

type AnsweredQuery =
  | {
      status: "answered";
      mode: "single";
      answer: string;
      sql: string;
      rowsUsed: QueryRow[];
    }
  | {
      status: "answered";
      mode: "plan";
      answer: string;
      steps: Array<{
        id: string;
        purpose: string;
        sql: string;
        rowsUsed: QueryRow[];
      }>;
    };

type RefusedQuery = {
  status: "refused";
  reason: string;
};

export type ChatResponse = {
  id: string;
  conversationId: string;
  message: string;
  status: ChatStatus;
  intent: ChatIntent;
  result:
    | {
        status: "answered" | "refused";
        intent: "data_question";
        result: AnsweredQuery | RefusedQuery;
      }
    | {
        status: "report_pending" | "clarification" | "refused";
        intent: Exclude<ChatIntent, "data_question">;
        message: string;
      };
};

export type SendChatMessageInput = {
  message: string;
  conversationId?: string;
};

export type ChatViewMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: ChatStatus;
  intent?: ChatIntent;
  queryBlocks?: QueryResultBlock[];
};
