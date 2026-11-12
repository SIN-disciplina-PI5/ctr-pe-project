import { Platform } from "react-native";
import {
  Recaptcha,
  RecaptchaAction,
  type RecaptchaClient,
} from "@google-cloud/recaptcha-enterprise-react-native";

const ANDROID_SITE_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_ANDROID_SITE_KEY;
const IOS_SITE_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_IOS_SITE_KEY;

let clientPromise: Promise<RecaptchaClient> | null = null;

function getSiteKey(): string | undefined {
  if (Platform.OS === "android") {
    return ANDROID_SITE_KEY;
  }

  if (Platform.OS === "ios") {
    return IOS_SITE_KEY;
  }

  return undefined;
}

export function isRecaptchaConfigured(): boolean {
  return Boolean(getSiteKey());
}

// O client deve ser inicializado apenas uma vez durante o ciclo de vida do app.
function getClient(siteKey: string): Promise<RecaptchaClient> {
  if (!clientPromise) {
    clientPromise = Recaptcha.fetchClient(siteKey);
  }
  return clientPromise;
}

function resolveAction(action: string) {
  if (action === "login") {
    return RecaptchaAction.LOGIN();
  }
  return RecaptchaAction.custom(action);
}

export async function getRecaptchaToken(
  action: string,
): Promise<string | undefined> {
  const siteKey = getSiteKey();
  if (!siteKey) return undefined;

  const client = await getClient(siteKey);
  return client.execute(resolveAction(action));
}
