import {
  decodePortalPayload,
  getContactById,
  getDealById,
  updateDealById,
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

    const dealId = formData.dealId;
    if (!dealId) {
      return res.status(400).json({
        message: "Missing dealId in form data.",
      });
    }

    const deal = await getDealById(dealId, ["dealname"]);

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found.",
      });
    }

    // Helper to check if a field is empty or missing
    const isEmpty = (val) =>
      val === undefined ||
      val === null ||
      (Array.isArray(val) && val.length === 0) ||
      (typeof val === "string" && val.trim() === "");

    // Collect errors
    const errors = {};

    // Basic required fields
    if (isEmpty(formData.company_background)) {
      errors.company_background = "Please enter your company background.";
    }
    if (isEmpty(formData.contact_role)) {
      errors.contact_role = "Please specify your role.";
    }
    if (isEmpty(formData.hear_about_us)) {
      errors.hear_about_us = "Let us know how you heard about us.";
    }

    // Ensure arrays for multi-select fields
    const interested_in = [].concat(formData.interested_in || []);
    const services_interested = [].concat(formData.services_interested || []);

    if (interested_in.length === 0) {
      errors.interested_in = "Select at least one area of interest.";
    }
    if (services_interested.length === 0) {
      errors.services_interested = "Select at least one service of interest.";
    }

    if (isEmpty(formData.implementation_timeline)) {
      errors.implementation_timeline = "Select your implementation timeline.";
    }
    if (isEmpty(formData.urgency_level)) {
      errors.urgency_level = "Select the urgency level.";
    }
    if (isEmpty(formData.is_ecommerce)) {
      errors.is_ecommerce =
        "Please select whether you're an eCommerce business.";
    }

    // eCommerce-specific fields (only if is_ecommerce is 'Yes')
    if (formData.is_ecommerce === "Yes") {
      if (isEmpty(formData.current_platform)) {
        errors.current_platform = "Enter your current eCommerce platform.";
      }

      const considering_platforms = [].concat(
        formData.considering_platforms || []
      );
      if (considering_platforms.length === 0) {
        errors.considering_platforms =
          "Select at least one platform you're considering.";
      }

      const business_type = [].concat(formData.business_type || []);
      if (business_type.length === 0) {
        errors.business_type = "Select your business type.";
      }

      if (isEmpty(formData.annual_revenue)) {
        errors.annual_revenue = "Enter your annual online revenue.";
      }

      if (isEmpty(formData.online_percentage)) {
        errors.online_percentage = "Specify online revenue percentage.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Please fill all required fields.",
        errors,
      });
    }

    // 1. Define a map: formData key → HubSpot internal property
    const propertyMap = {
      company_background: "company_background",
      contact_role: "role_of_the_contact",
      hear_about_us: "how_did_you_hear_about_kensium",
      existing_var: "existing_var__if_working_with_an_erp",
      current_challenges:
        "what_challenges_are_you_currently_facing_in_relevant_area",
      solution_prompt: "what_prompted_you_to_look_for_a_solution_now",
      implementation_timeline: "when_are_you_looking_to_implement_a_solution",
      urgency_level: "how_urgent_is_this_need_on_your_priority_list",
      decision_criteria:
        "what_criteria_are_most_important_to_you_when_choosing_a_solution",
      evaluation_process: "what_does_your_evaluation_process_look_like",
      decision_makers: "who_else_is_involved_in_the_decision_making_process",
      leadership_aligned:
        "is_the_leadership_and_finance_team_aligned_and_ready_to_move_forward_on_this_initiative",
      budget_approved: "is_the_budget_for_this_initiative_already_approved",
      rfp_status: "is_there_an_rfq_rfp",
      // is_ecommerce: "is_ecommerce",
      current_platform:
        "what_ecommerce_platform_are_you_currently_using__if_any",
      considering_platforms: "what_ecommerce_platform_s__are_you_considering",
      business_type: "are_you_a_b2c_business__b2b_business__or_both",
      annual_revenue: "what_is_your_annual_online_revenue",
      online_percentage:
        "what_percentage_of_your_revenue_comes_from_online_sales",
      important_kpis:
        "what_kpis_are_most_important_to_your_ecommerce_business_right_now__e_g___conversion_rate__aov__cart",
      performance_tracking:
        "how_are_you_currently_tracking_performance_across_your_sales_funnel",
      metric_improvement:
        "if_we_could_help_you_increase_a_metric__what_would_that_be__and_what_would_it_mean_for_your_busines",
      top_requirements:
        "top_3_things_you_re_looking_for_from_your_ecommerce_platform_tool",
      tech_stack:
        "what_is_your_current_tech_stack__are_there_any_integrations_or_technical_requirements_that_are_esse",
      vendor_comparison:
        "how_are_you_comparing_different_vendors_or_solutions_",
      ideal_solution: "what_would_your_ideal_solution_look_like",
      decision_process:
        "what_does_your_decision_making_process_look_like_from_evaluation_to_purchase",
      evaluation_team: "who_else_is_involved_in_the_evaluation_process",
      decision_timeline: "when_are_you_hoping_to_make_a_final_decision",
      current_setup_challenge:
        "what_s_the_biggest_challenge_you_re_facing_with_your_current_ecommerce_setup",
      checkout_bottlenecks:
        "are_there_any_bottlenecks_in_your_customer_journey_or_checkout_process",
      consequence_unsolved:
        "what_happens_if_you_don_t_solve_this_problem_in_the_next_3_6_months",
      team_benefit: "who_on_your_team_would_benefit_most_from_this_solution",
      excited_department:
        "a_department_that_would_be_particularly_excited_about_improving_their_area_with_this_project",
      interested_in: "interested_in",
      products_interested_in: "product_s__interested_in",
      services_interested: "service_s__interested_in",
    };

    const propertiesMap = {};
    for (const [formKey, hsName] of Object.entries(propertyMap)) {
      let val = formData[formKey];
      if (Array.isArray(val)) val = val.join(";");
      propertiesMap[hsName] = String(val ?? "");
    }

    // update the deal with the new properties
    const updateResult = await updateDealById(dealId, propertiesMap);

    if (!updateResult || updateResult.error) {
      return res.status(500).json({
        message: "Failed to update deal in HubSpot.",
        error:
          updateResult && updateResult.error ? updateResult.error : undefined,
      });
    }

    res.json({
      message: "Form submitted successfully",
      data: formData,
    });
  } catch (err) {
    next(err);
  }
}
