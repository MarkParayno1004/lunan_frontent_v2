"use client";

const csrfUrl = process.env.NEXT_PUBLIC_CSRF_URL ?? "http://localhost:8000/csrf/";

let cachedCsrfToken: string | null = null;

type CsrfResponse = {
  csrfToken?: string;
  csrf_token?: string;
  token?: string;
};

function extractCsrfToken(payload: CsrfResponse) {
  return payload.csrfToken ?? payload.csrf_token ?? payload.token ?? null;
}

export async function getCsrfToken() {
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }

  const response = await fetch(csrfUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CSRF bootstrap failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as CsrfResponse;
  const token = extractCsrfToken(payload);
  if (!token) {
    throw new Error("CSRF endpoint did not return a token in JSON response.");
  }

  cachedCsrfToken = token;
  return token;
}
