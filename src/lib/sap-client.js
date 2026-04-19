const SAP_BASE_URL = process.env.SAP_BASE_URL;
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PASSWORD = process.env.SAP_PASSWORD;
const REJECTION_SERVICE = process.env.SAP_REJECTION_SERVICE;
const WORKFLOW_SERVICE = process.env.SAP_WORKFLOW_SERVICE;

function getAuthHeader() {
  const credentials = Buffer.from(`${SAP_USERNAME}:${SAP_PASSWORD}`).toString("base64");
  return `Basic ${credentials}`;
}

function getHeaders(extraHeaders = {}) {
  return {
    Authorization: getAuthHeader(),
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-csrf-token": "Fetch",
    ...extraHeaders,
  };
}

async function fetchCsrfToken(serviceUrl) {
  const res = await fetch(`${SAP_BASE_URL}${serviceUrl}`, {
    method: "HEAD",
    headers: {
      Authorization: getAuthHeader(),
      "x-csrf-token": "Fetch",
    },
  });
  return res.headers.get("x-csrf-token") || "";
}

async function sapGet(servicePath, entityPath, params = {}) {
  const url = new URL(`${SAP_BASE_URL}${servicePath}${entityPath}`);
  url.searchParams.set("$format", "json");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SAP GET failed (${res.status}): ${text}`);
  }

  return res.json();
}

async function sapPost(servicePath, entityPath, payload) {
  const csrfToken = await fetchCsrfToken(servicePath);
  const url = `${SAP_BASE_URL}${servicePath}${entityPath}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "x-csrf-token": csrfToken,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SAP POST failed (${res.status}): ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return { success: true };
}

async function sapPatch(servicePath, entityPath, payload) {
  const csrfToken = await fetchCsrfToken(servicePath);
  const url = `${SAP_BASE_URL}${servicePath}${entityPath}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      ...getHeaders(),
      "x-csrf-token": csrfToken,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SAP PATCH failed (${res.status}): ${text}`);
  }

  return { success: true };
}

async function sapDelete(servicePath, entityPath) {
  const csrfToken = await fetchCsrfToken(servicePath);
  const url = `${SAP_BASE_URL}${servicePath}${entityPath}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      ...getHeaders(),
      "x-csrf-token": csrfToken,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SAP DELETE failed (${res.status}): ${text}`);
  }

  return { success: true };
}

function guidPath(entitySet, guid) {
  return `/${entitySet}(guid'${guid}')`;
}

export {
  sapGet,
  sapPost,
  sapPatch,
  sapDelete,
  guidPath,
  REJECTION_SERVICE,
  WORKFLOW_SERVICE,
};
