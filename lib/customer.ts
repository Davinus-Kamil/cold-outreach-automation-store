export type CustomerDetails = {
  name: string;
  email: string;
  company: string;
  marketingConsent: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseEmail(value: unknown): string | null {
  const email = readTrimmedString(value).toLowerCase();
  return EMAIL_PATTERN.test(email) ? email : null;
}

export function parseCustomer(input: unknown): CustomerDetails | null {
  if (typeof input !== "object" || input === null) {
    return null;
  }

  const data = input as Record<string, unknown>;
  const name = readTrimmedString(data.name);
  const email = parseEmail(data.email);
  const company = readTrimmedString(data.company);
  const marketingConsent = data.marketingConsent === true;

  if (!name || !email) {
    return null;
  }

  if (data.marketingConsent !== undefined && typeof data.marketingConsent !== "boolean") {
    return null;
  }

  return { name, email, company, marketingConsent };
}
