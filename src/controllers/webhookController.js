import {
  getContactById,
  getFirstContactAssociation,
  getDealById,
  buildPortalLink,
} from "../utils/hubspot_utils.js";

export async function handleWebhook(req, res, next) {
  try {
    const { deal_id } = req.body;
    if (!deal_id) {
      return res.status(400).json({ error: "Missing deal_id in request body" });
    }

    // Fetch deal and its first associated contact
    let deal;
    let contact;
    try {
      deal = await getDealById(deal_id, []);
      const assocContactId = await getFirstContactAssociation(deal_id);
      contact = await getContactById(assocContactId, ["email"]);
    } catch (err) {
      if (err.status === 404) {
        return res
          .status(404)
          .json({ error: "Deal or associated contact not found" });
      }
      throw err;
    }

    // Build secure portal link
    const portalLink = buildPortalLink(contact, deal);

    return res.status(200).json({
      data: {
        deal: { id: deal.id },
        contact: { id: contact.id, email: contact.properties?.email || null },
        portalLink,
      },
    });
  } catch (err) {
    next(err);
  }
}
