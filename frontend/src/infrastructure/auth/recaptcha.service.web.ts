import { Platform } from "react-native";

const RECAPTCHA_SITE_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_WEB_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (
          siteKey: string,
          options: { action: string },
        ) => Promise<string>;
      };
    };
  }
}

function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha?.enterprise) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="recaptcha/enterprise.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Não foi possível carregar o reCAPTCHA.")),
      );
      return;
    }

    const script = document.createElement("script");

    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Não foi possível carregar o reCAPTCHA."));

    document.head.appendChild(script);
  });
}

export async function getRecaptchaToken(action: string): Promise<string> {
  if (Platform.OS !== "web") {
    throw new Error("reCAPTCHA Web não está disponível nesta plataforma.");
  }

  if (!RECAPTCHA_SITE_KEY) {
    throw new Error(
      "EXPO_PUBLIC_RECAPTCHA_WEB_SITE_KEY não configurada.",
    );
  }

  await loadRecaptchaScript();

  if (!window.grecaptcha?.enterprise) {
    throw new Error("reCAPTCHA Enterprise não foi carregado.");
  }

  return new Promise((resolve, reject) => {
    window.grecaptcha!.enterprise.ready(async () => {
      try {
        const token = await window.grecaptcha!.enterprise.execute(
          RECAPTCHA_SITE_KEY,
          { action },
        );

        resolve(token);
      } catch (error) {
        reject(
            error instanceof Error
            ? error
            : new Error("Não foi possível gerar o token do reCAPTCHA."),
        );
        }
    });
  });
}