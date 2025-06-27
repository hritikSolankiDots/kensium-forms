import axios from "axios";
import createError from "http-errors";

const { HUBSPOT_ACCESS_TOKEN, PORTAL_BASE_URL } = process.env;
if (!HUBSPOT_ACCESS_TOKEN)
  throw new Error("Missing HUBSPOT_ACCESS_TOKEN in environment");

// Base client configuration
const crmClient = axios.create({
  baseURL: "https://api.hubapi.com/crm/v3/objects",
  headers: { Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}` },
});

/**
 * Fetch a contact by its ID.
 */
export async function getContactById(
  id,
  properties = ["email", "firstname", "lastname"]
) {
  try {
    const { data } = await crmClient.get(`/contacts/${id}`, {
      params: { properties: properties.join(",") },
    });
    return data;
  } catch (err) {
    if (err.response?.status === 404)
      throw createError(404, "Contact not found");
    throw err;
  }
}

/**
 * Fetch a deal by its ID.
 */
export async function getDealById(id, properties = ["dealname"]) {
  try {
    const { data } = await crmClient.get(`/deals/${id}`, {
      params: { properties: properties.join(",") },
    });
    return data;
  } catch (err) {
    if (err.response?.status === 404) throw createError(404, "Deal not found");
    throw err;
  }
}

/**
 * Get the first associated contact ID for a given deal.
 */
export async function getFirstContactAssociation(dealId) {
  const { data } = await crmClient.get(
    `/deals/${dealId}/associations/contacts`,
    {
      params: { limit: 1 },
    }
  );
  const assoc = data.results?.[0];
  if (!assoc) throw createError(404, "No contact associated with deal");
  return assoc.id;
}

/**
 * Updates a Deal in HubSpot by ID, using your existing crmClient axios instance.
 */
export async function updateDealById(id, properties) {
  // Remove any empty values—HubSpot hates empty strings on certain fields
  const cleanProps = {};
  Object.entries(properties).forEach(([key, val]) => {
    if (val != null && val !== "") {
      cleanProps[key] = val;
    }
  });

  const payload = { properties: cleanProps };

  try {
    const response = await crmClient.patch(`/deals/${id}`, payload);
    if (
      response.data &&
      (response.data.status === "error" || response.data.errors)
    ) {
      throw createError(400, response.data.message || "HubSpot update failed", {
        details: response.data,
      });
    }
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error(
        `❌ HubSpot ${err.response.status}:`,
        JSON.stringify(err.response.data, null, 2)
      );
    }
    throw err;
  }
}

/**
 * Encode payload into a base64 query parameter.
 */
export const encodePortalPayload = (payload) =>
  Buffer.from(JSON.stringify(payload)).toString("base64");

/**
 * Decode portal payload from base64 query parameter.
 */
export const decodePortalPayload = (encoded) => {
  const json = Buffer.from(decodeURIComponent(encoded), "base64").toString(
    "utf-8"
  );
  return JSON.parse(json);
};

/**
 * Build a secure portal link for document uploads with contact context.
 */
export function buildPortalLink(contact, deal) {
  const payload = {
    contactId: contact.id,
    email: contact.properties?.email || contact.email,
    dealId: deal?.id,
  };
  const encoded = encodePortalPayload(payload);
  return `${PORTAL_BASE_URL}/bdr-form?data=${encodeURIComponent(encoded)}`;
}
