import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

export class RecaptchaService {
  private client = new RecaptchaEnterpriseServiceClient();

  async validateToken(
    token: string,
    siteKey: string,
    expectedAction: string,
    userAgent?: string,
    userIpAddress?: string,
  ): Promise<boolean> {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5);

    if (!projectId) {
      throw new Error("GOOGLE_CLOUD_PROJECT_ID não configurado.");
    }

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

    const result = await this.client.createAssessment(assessmentRequest);
    const response = result[0];

    if (!response.tokenProperties?.valid) {
      return false;
    }

    if (response.tokenProperties.action !== expectedAction) {
      return false;
    }

    const score = response.riskAnalysis?.score ?? 0;

    return score >= minScore;
  }
}