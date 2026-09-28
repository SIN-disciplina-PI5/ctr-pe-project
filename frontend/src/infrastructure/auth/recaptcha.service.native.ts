import { Platform } from "react-native";
import {
  Recaptcha,
  RecaptchaAction,
  type RecaptchaClient,
} from "@google-cloud/recaptcha-enterprise-react-native";

const ANDROID_SITE_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_ANDROID_SITE_KEY;
const IOS_SITE_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_IOS_SITE_KEY;

let clientPromise: Promise<RecaptchaClient> | null = null;

function getSiteKey(): string {
  if (Platform.OS === "android") {
    if (!ANDROID_SITE_KEY) {
      throw new Error(
        "EXPO_PUBLIC_RECAPTCHA_ANDROID_SITE_KEY não configurada.",
      );
    }
    return ANDROID_SITE_KEY;
  }

  if (Platform.OS === "ios") {
    if (!IOS_SITE_KEY) {
      throw new Error("EXPO_PUBLIC_RECAPTCHA_IOS_SITE_KEY não configurada.");
    }
    return IOS_SITE_KEY;
  }

  throw new Error("Plataforma não suportada pelo reCAPTCHA nativo.");
}

// O client deve ser inicializado apenas uma vez durante o ciclo de vida do app.
function getClient(): Promise<RecaptchaClient> {
  if (!clientPromise) {
    clientPromise = Recaptcha.fetchClient(getSiteKey());
  }
  return clientPromise;
}

function resolveAction(action: string) {
  if (action === "LOGIN") {
    return RecaptchaAction.LOGIN();
  }
  return RecaptchaAction.custom(action);
}

export async function getRecaptchaToken(action: string): Promise<string> {
  const client = await getClient();
  return client.execute(resolveAction(action));
}