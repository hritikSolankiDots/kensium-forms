import {
  decodePortalPayload,
  getContactById,
  getDealById,
} from "../utils/hubspot_utils.js";

export async function bdrFormShow(req, res, next) {
  try {
    const encoded = req.query.data;
    if (!encoded) return res.status(400).send("Missing data parameter");

    // Decode payload
    const { contactId, dealId } = decodePortalPayload(encoded);

    // Fetch up-to-date contact and deal properties
    const contact = await getContactById(contactId, [
      "firstname",
      "lastname",
      "email",
      "phone",
    ]);
    const deal = await getDealById(dealId, ["dealname"]);
    if (!contact || !deal) {
      return res.status(404).send("Contact or deal not found");
    }

    res.render("bdr-form", {
      contact: { id: contact.id, properties: contact.properties },
      deal: { id: deal.id, properties: deal.properties },
    });
  } catch (err) {
    next(err);
  }
}

export async function bdrFormSubmit(req, res, next) {
  try {
    const formData = req.body;

    // Helper to check if a field is empty or missing
    const isEmpty = (val) =>
      val === undefined ||
      val === null ||
      (Array.isArray(val) && val.length === 0) ||
      (typeof val === "string" && val.trim() === "");

    // Collect errors
    const errors = {};

    // Basic required fields
    if (isEmpty(formData.company_background))
      errors.company_background = "This field is required.";
    if (isEmpty(formData.contact_role))
      errors.contact_role = "This field is required.";
    if (isEmpty(formData.hear_about_us))
      errors.hear_about_us = "This field is required.";

    // Checkbox groups: ensure always arrays
    const interested_in = [].concat(formData.interested_in || []);
    const services_interested = [].concat(formData.services_interested || []);

    if (interested_in.length === 0)
      errors.interested_in = "Select at least one option.";
    if (services_interested.length === 0)
      errors.services_interested = "Select at least one option.";

    if (isEmpty(formData.implementation_timeline))
      errors.implementation_timeline = "This field is required.";
    if (isEmpty(formData.urgency_level))
      errors.urgency_level = "This field is required.";
    if (isEmpty(formData.is_ecommerce))
      errors.is_ecommerce = "Please select an option.";

    // Ecommerce-specific required fields
    if (formData.is_ecommerce === "Yes") {
      if (isEmpty(formData.current_platform))
        errors.current_platform = "This field is required.";
      const considering_platforms = [].concat(
        formData.considering_platforms || []
      );
      if (considering_platforms.length === 0)
        errors.considering_platforms = "Select at least one option.";
      const business_type = [].concat(formData.business_type || []);
      if (business_type.length === 0)
        errors.business_type = "Select at least one option.";
      if (isEmpty(formData.annual_revenue))
        errors.annual_revenue = "This field is required.";
      if (isEmpty(formData.online_percentage))
        errors.online_percentage = "This field is required.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Please fill all required fields.",
        errors,
      });
    }

    // ...save or process formData...
    res.json({
      message: "Form submitted successfully",
      data: formData,
    });
  } catch (err) {
    next(err);
  }
}
