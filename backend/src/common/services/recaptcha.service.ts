import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

type RecaptchaClient = Pick<
  RecaptchaEnterpriseServiceClient,
  "projectPath" | "createAssessment"
>;

export class RecaptchaService {
  constructor(
    private readonly client: RecaptchaClient =
      new RecaptchaEnterpriseServiceClient(),
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
