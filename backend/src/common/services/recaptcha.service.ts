import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
import { GoogleAuth, JWT, type JWTInput } from "google-auth-library";

type RecaptchaClient = Pick<
  RecaptchaEnterpriseServiceClient,
  "projectPath" | "createAssessment"
>;

type ServiceAccountCredentials = {
  type: "service_account";
  client_email: string;
  private_key: string;
};

function createRecaptchaClient(): RecaptchaClient {
  const credentialsJson = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON;

  if (!credentialsJson) {
    return new RecaptchaEnterpriseServiceClient();
  }

  let parsedCredentials: unknown;

  try {
    parsedCredentials = JSON.parse(credentialsJson) as unknown;
  } catch {
    throw new Error("GOOGLE_CLOUD_CREDENTIALS_JSON contém JSON inválido.");
  }

  if (
    typeof parsedCredentials !== "object" ||
    parsedCredentials === null ||
    !("type" in parsedCredentials) ||
    parsedCredentials.type !== "service_account" ||
    !("client_email" in parsedCredentials) ||
    typeof parsedCredentials.client_email !== "string" ||
    !("private_key" in parsedCredentials) ||
    typeof parsedCredentials.private_key !== "string"
  ) {
    throw new Error(
      "GOOGLE_CLOUD_CREDENTIALS_JSON não contém as credenciais obrigatórias.",
    );
  }

  const credentials: ServiceAccountCredentials = {
    type: parsedCredentials.type,
    client_email: parsedCredentials.client_email,
    private_key: parsedCredentials.private_key,
  };

  const authClient = new JWT();
  authClient.fromJSON(credentials as JWTInput);

  return new RecaptchaEnterpriseServiceClient({
    auth: new GoogleAuth({ authClient }),
  });
}

export class RecaptchaService {
  constructor(
    private readonly client: RecaptchaClient = createRecaptchaClient(),
  ) {}

  async validateToken(
    token: string,
    siteKey: string,
    expectedAction: string,
    userAgent?: string,
    userIpAddress?: string,
  ): Promise<boolean> {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5);

    if (
      !token ||
      !siteKey ||
      !projectId ||
      !Number.isFinite(minScore) ||
      minScore < 0 ||
      minScore > 1
    ) {
      return false;
    }

    try {
      const event = {
        token,
        siteKey,
        expectedAction,
        ...(userAgent ? { userAgent } : {}),
        ...(userIpAddress ? { userIpAddress } : {}),
      };

      const assessmentRequest = {
        parent: this.client.projectPath(projectId),
        assessment: {
          event,
        },
      };

      const [response] = await this.client.createAssessment(assessmentRequest);

      if (!response.tokenProperties?.valid) {
        return false;
      }

      if (response.tokenProperties.action !== expectedAction) {
        return false;
      }

      const score = response.riskAnalysis?.score ?? 0;
      return score >= minScore;
    } catch {
      return false;
    }
  }
}
