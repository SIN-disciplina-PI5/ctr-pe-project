export interface QStashPublishConfig {
  readonly token: string;
  readonly reportJobUrl: string;
}

export interface QStashReceiverConfig {
  readonly currentSigningKey: string;
  readonly nextSigningKey: string;
  readonly reportJobUrl: string;
  readonly sweepUrl: string;
}

function required(environment: NodeJS.ProcessEnv, name: string): string {
  const value = environment[name]?.trim();
  if (!value) throw new Error(`${name} é obrigatória quando o QStash está ativo.`);
  return value;
}

function reportJobUrl(environment: NodeJS.ProcessEnv): string {
  const value = required(environment, "QSTASH_REPORT_JOB_URL");
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("QSTASH_REPORT_JOB_URL deve ser uma URL absoluta válida.");
  }

  if (url.protocol !== "https:") {
    throw new Error("QSTASH_REPORT_JOB_URL deve usar HTTPS.");
  }

  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export function loadQStashPublishConfig(
  environment: NodeJS.ProcessEnv = process.env,
): QStashPublishConfig {
  return {
    token: required(environment, "QSTASH_TOKEN"),
    reportJobUrl: reportJobUrl(environment),
  };
}

export function loadQStashReceiverConfig(
  environment: NodeJS.ProcessEnv = process.env,
): QStashReceiverConfig {
  const workerUrl = reportJobUrl(environment);
  return {
    currentSigningKey: required(environment, "QSTASH_CURRENT_SIGNING_KEY"),
    nextSigningKey: required(environment, "QSTASH_NEXT_SIGNING_KEY"),
    reportJobUrl: workerUrl,
    sweepUrl: `${workerUrl}/sweep`,
  };
}
