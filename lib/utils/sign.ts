import { constantCase } from "change-case";

export interface Metadata {
  message: string;
  [x: string]: any;
}

export function getSignMessageTemplate(data: Metadata) {
  const { message, ...rest } = data;

  return `${data.message}

${Object.keys(rest).map(key => `${constantCase(key).replace(/_/g, " ")}:
${rest[key]}`).join("\n\n")}`;
}
