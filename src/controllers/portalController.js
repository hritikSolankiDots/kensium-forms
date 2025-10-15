import {
  getContactById,
  getDealById,
  getFirstContactAssociation,
  updateDealById,
} from "../utils/hubspot_utils.js";

export async function bdrFormShow(req, res, next) {
  try {
    const dealId = req.query.data;
    if (!dealId) return res.status(400).send("Missing data parameter");

    const contactId = await getFirstContactAssociation(dealId);

    // Fetch up-to-date contact and deal properties
    const contact = await getContactById(contactId, [
      "firstname",
      "lastname",
      "email",
      "phone",
    ]);
    const deal = await getDealById(dealId, ["dealname", "company_background", "role_of_the_contact",
      "how_did_you_hear_about_kensium", "existing_var__if_working_with_an_erp",
      "what_challenges_are_you_currently_facing_in_relevant_area", "what_prompted_you_to_look_for_a_solution_now",
      "when_are_you_looking_to_implement_a_solution", "how_urgent_is_this_need_on_your_priority_list",
      "what_criteria_are_most_important_to_you when choosing a solution", "what_does_your_evaluation_process_look_like",
      "who_else_is_involved_in_the_decision_making_process",
      "is_the_leadership_and_finance_team_aligned_and_ready_to_move_forward_on_this_initiative",
      "is_the_budget_for_this_initiative_already_approved", "is_there_an_rfq_rfp", "is_ecommerce",
      "current_ecommerce_platform", "what_ecommerce_platform_s__are_you_considering",
      "are_you_a_b2c_business__b2b_business__or_both", "what_is_your_annual_online_revenue",
      "what_percentage_of_your_revenue_comes_from_online_sales", "interested_in", "product_s__interested_in",
      "service_s__interested_in", "a_department_that_would_be_particularly_excited_about_improving_their_area_with_this_project",
      "what_kpis_are_most_important_to_your_ecommerce_business_right_now__e_g___conversion_rate__aov__cart",
      "how_are_you_currently_tracking_performance_across_your_sales_funnel",
      "if_we_could_help_you_increase_a_metric__what_would_that_be__and_what_would_it_mean_for_your_busines",
      "top_3_things_you_re_looking_for_from_your_ecommerce_platform_tool",
      "what_is_your_current_tech_stack__are_there_any_integrations_or_technical_requirements_that_are_esse",
      "how_are_you_comparing_different_vendors_or_solutions_",
      "what_would_your_ideal_solution_look_like",
      "what_does_your_decision_making_process_look_like_from_evaluation_to_purchase",
      "who_else_is_involved_in_the_evaluation_process",
      "when_are_you_hoping_to_make_a_final_decision",
      "what_s_the_biggest_challenge_you_re_facing_with_your_current_ecommerce_setup",
      "are_there_any_bottlenecks_in_your_customer_journey_or_checkout_process",
      "what_happens_if_you_don_t_solve_this_problem_in_the_next_3_6_months",
      "who_on_your_team_would_benefit_most_from_this_solution",
      "what_criteria_are_most_important_to_you_when_choosing_a_solution",]);

    if (!contact || !deal) {
      return res.status(404).send("Contact or deal not found");
    }

    const commerce_bdrNames = ["Shena L"];
    const presalesNames = ["Asha A", "Srimanth G", "Srinivas K", "Tharanga P"];
    const product_salesNames = ["Amit M", "Deepak N", "Shena L"];
    const commerce_salesNames = ["Damir V", "Durga P", "Ted S", "Yasmen B"];

    res.render("bdr-form", {
      contact: { id: contact.id, properties: contact.properties },
      deal: { id: deal.id, properties: deal.properties },
      formData: {
        company_background: deal.properties.company_background || "",
        contact_role: deal.properties.role_of_the_contact || "",
        hear_about_us: deal.properties.how_did_you_hear_about_kensium || "",
        existing_var: deal.properties.existing_var__if_working_with_an_erp || "",
        current_challenges: deal.properties.what_challenges_are_you_currently_facing_in_relevant_area || "",
        solution_prompt: deal.properties.what_prompted_you_to_look_for_a_solution_now || "",
        implementation_timeline: deal.properties.when_are_you_looking_to_implement_a_solution || "",
        urgency_level: deal.properties.how_urgent_is_this_need_on_your_priority_list || "",
        decision_criteria: deal.properties.what_criteria_are_most_important_to_you_when_choosing_a_solution || "",
        evaluation_process: deal.properties.what_does_your_evaluation_process_look_like || "",
        decision_makers: deal.properties.who_else_is_involved_in_the_decision_making_process || "",
        leadership_aligned: deal.properties.is_the_leadership_and_finance_team_aligned_and_ready_to_move_forward_on_this_initiative || "",
        budget_approved: deal.properties.is_the_budget_for_this_initiative_already_approved || "",
        rfp_status: deal.properties.is_there_an_rfq_rfp || "",
        is_ecommerce: deal.properties.is_ecommerce === 'true' ? 'Yes' : 'No' || "",
        current_platform: deal.properties.current_ecommerce_platform || "",
        considering_platforms: deal.properties.what_ecommerce_platform_s__are_you_considering || "",
        business_type: deal.properties.are_you_a_b2c_business__b2b_business__or_both || "",
        annual_revenue: deal.properties.what_is_your_annual_online_revenue || "",
        online_percentage: deal.properties.what_percentage_of_your_revenue_comes_from_online_sales || "",
        interested_in: deal.properties.interested_in ? deal.properties.interested_in.split(";") : [],
        products_interested_in: deal.properties.product_s__interested_in ? deal.properties.product_s__interested_in.split(";") : [],
        services_interested: deal.properties.service_s__interested_in ? deal.properties.service_s__interested_in.split(";") : [],
        excited_department: deal.properties.a_department_that_would_be_particularly_excited_about_improving_their_area_with_this_project || "",
        important_kpis: deal.properties.what_kpis_are_most_important_to_your_ecommerce_business_right_now__e_g___conversion_rate__aov__cart || "",
        performance_tracking: deal.properties.how_are_you_currently_tracking_performance_across_your_sales_funnel || "",
        metric_improvement: deal.properties.if_we_could_help_you_increase_a_metric__what_would_that_be__and_what_would_it_mean_for_your_busines || "",
        top_requirements: deal.properties.top_3_things_you_re_looking_for_from_your_ecommerce_platform_tool || "",
        tech_stack: deal.properties.what_is_your_current_tech_stack__are_there_any_integrations_or_technical_requirements_that_are_esse || "",
        vendor_comparison: deal.properties.how_are_you_comparing_different_vendors_or_solutions_ || "",
        ideal_solution: deal.properties.what_would_your_ideal_solution_look_like || "",
        decision_process: deal.properties.what_does_your_decision_making_process_look_like_from_evaluation_to_purchase || "",
        evaluation_team: deal.properties.who_else_is_involved_in_the_evaluation_process || "",
        decision_timeline: deal.properties.when_are_you_hoping_to_make_a_final_decision || "",
        current_setup_challenge: deal.properties.what_s_the_biggest_challenge_you_re_facing_with_your_current_ecommerce_setup || "",
        checkout_bottlenecks: deal.properties.are_there_any_bottlenecks_in_your_customer_journey_or_checkout_process || "",
        consequence_unsolved: deal.properties.what_happens_if_you_don_t_solve_this_problem_in_the_next_3_6_months || "",
        team_benefit: deal.properties.who_on_your_team_would_benefit_most_from_this_solution || "",
      },
      commerce_bdrNames,
      presalesNames,
      product_salesNames,
      commerce_salesNames,
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
      is_ecommerce: "is_ecommerce",
      current_platform:
        "current_ecommerce_platform",
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
      if (formKey === "is_ecommerce") {
        if (val === "Yes") val = true;
        else if (val === "No") val = false;
        else continue;
      }
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

export async function salesDiscoveryFormShow(req, res, next) {
  try {
    const dealId = req.query.data;
    if (!dealId) return res.status(400).send("Missing data parameter");

    const contactId = await getFirstContactAssociation(dealId);
    // Fetch up-to-date contact and deal properties
    const contact = await getContactById(contactId, [
      "firstname",
      "lastname",
      "email",
      "phone",
    ]);
    const deal = await getDealById(dealId, ["dealname",
      'markets_regions_do_you_currently_serve_and_do_you_have_plans_to_expand_into_new_markets_region',
      'who_are_your_top_3_competitors_how_do_you_differentiate_from_them',
      'do_you_manufacture_products_internal_or_contract_manufacturing__or_are_you_a_reseller_distributor',
      'what_sales_channels_do_you_operate__online__retail__marketplaces__phone_calls__etc_',
      'main_product_categories_and_how_many_categories_products_do_you_have',
      'are_you_primarily_selling_physical_products_digital_products_services_or_a_mix',
      'do_you_manage_multiple_brands_or_storefronts__multiple_websites',
      'who_is_the_primary_target_audience_for_your_products_or_services',
      'how_many_different_customer_groups_do_you_have__and_do_they_see_different_prices_or_products',
      'what_is_your_current_technology_stack__and_what_challenges_do_you_face_with_it',
      'what_s_working_well_on_your_current_systems_processes_that_you_would_like_to_preserve',
      'what_are_the_languages_currencies_used_or_proposed_to_be_used',
      'what_are_your_biggest_user_experience_challenges_with_your_current_website',
      'what_feedback_have_you_received_from_customers_about_your_current_website',
      'are_you_planning_a_rebrand_or_visual_refresh_as_part_of_this_project',
      'are_there_any_unique_things_about_how_your_business_works_or_how_you_sell',
      'how_many_sales_orders_does_your_organization_generate_monthly',
      'what_is_your_current_conversion_rate_and_average_order_value',
      'do_your_sales_fluctuate_seasonally',
      'do_you_have_any_specific_website_speed_and_performance_expectations',
      'what_s_your_current_marketing_strategy__and_how_do_you_acquire_customers',
      'what_s_your_biggest_challenge_with_online_customer_acquisition_and_retention',
      'what_digital_marketing_channels_are_you_currently_using_to_drive_traffic',
      'which_platforms_or_campaigns_have_been_most_effective',
      'how_do_you_currently_track_and_measure_your_website_and_marketing_performance',
      'what_tools_are_currently_in_your_marketing_tech_stack_crm_email_platform_cms_analytics_etc',
      'what_are_your_top_marketing_priorities_this_quarter_or_year',
      'which_kpis_matter_most_to_you_right_now',
      'are_you_on_track_to_meet_those_kpis_if_not_what_s_getting_in_the_way',
      'do_you_have_a_defined_brand_bible_or_voice_guidelines',
      'what_s_not_working_in_your_marketing_today_that_you_d_like_to_improve',
      'if_you_had_a_magic_wand__what_would_your_ideal_marketing_setup_look_like_in_6_months',
      'do_you_have_internal_resources_for_creative__ux__and_digital_marketing__or_would_you_need_support',
      'what_is_your_content_creation_process_and_cadence',
      'do_you_need_help_with_content_strategy__and_seo',
      'what_systems_processes_or_tools_do_you_use_to_manage_sales_tax_and_compliance_today',
      'do_you_have_specific_compliance_or_regulatory_requirements_or_industry_specific_needs',
      'are_there_any_accessibility_standards_your_website_must_comply_with',
      'which_systems_absolutely_must_integrate_with_your_new_platform_versus_which_would_be_nice_to_have',
      'what_erp_or_back_office_systems_do_you_use__and_how_well_do_they_integrate_with_your_current_platfo',
      'how_do_you_handle_data_synchronization_across_systems_today_for_inventory__orders__pricing__and_cus',
      'what_systems_are_you_using_for_warehouse_or_supply_chain_management',
      'what_s_your_biggest_frustration_with_how_your_current_systems_work_together',
      'how_do_you_currently_handle_inventory_and_order_fulfillment_in_house_dropship_3pl_or_a_combination',
      'do_you_dropship_some_products_while_fulfilling_others_in_house',
      'how_do_you_handle_backorders_and_stockouts_currently',
      'how_do_you_currently_handle_customer_service',
      'walk_me_through_your_most_complicated_sale_from_quote_to_delivery_what_systems_touch_this_process',
      'how_many_team_members_are_involved_in_managing_your_online_store',
      'do_you_have_internal_it_support_available__if_not__do_you_outsource_it',
      'what_are_your_goals_for_moving_to__new_platform',
      'how_will_you_measure_success_of_this_project',
      'do_you_have_prior_experience_with_similar_projects',
      'do_you_have_assigned_resources_for_this_project',
      'what_support_would_you_need_post_go_live__tech_support__website_maintenance__content_strategy__conv',
      'are_there_any_non_negotiable_deadlines_we_need_to_work_around___like_seasonal_sales__contract_renew',
      'how_prepared_is_your_organization_for_change__are_there_any_internal_blockers_to_adoption',
      'are_there_any_concerns_about_training_or_onboarding_internal_users_to_the_new_system_',
      'what_does_a_successful_partnership_look_like_to_you',
      'what_s_your_budget_range_for_this_project',
      'who_signs_the_contract_and_approves_payments',
      'who_will_be_the_project_manager_on_your_side',
      'what_s_your_vendor_evaluation_and_selection_process',
      'are_you_evaluating_other_vendors_solutions', "commerce_bdr", "presales", "product_sales",
      "commerce_sales", "solutioning___sa_dev_creatives_"]);

    if (!contact || !deal) {
      return res.status(404).send("Contact or deal not found");
    }

    const commerce_bdrNames = ["Shena L"];
    const presalesNames = ["Asha A", "Srimanth G", "Srinivas K", "Tharanga P"];
    const product_salesNames = ["Amit M", "Deepak N", "Shena L"];
    const commerce_salesNames = ["Damir V", "Durga P", "Ted S", "Yasmen B"];

    res.render("sales-discovery-form", {
      contact: { id: contact.id, properties: contact.properties },
      deal: { id: deal.id, properties: deal.properties },
      formData: deal.properties,
      commerce_bdrNames,
      presalesNames,
      product_salesNames,
      commerce_salesNames,
    });
  } catch (err) {
    next(err);
  }
}

const propertyMap = {
  markets_regions_do_you_currently_serve_and_do_you_have_plans_to_expand_into_new_markets_region:
    "markets_regions_do_you_currently_serve_and_do_you_have_plans_to_expand_into_new_markets_region",
  who_are_your_top_3_competitors_how_do_you_differentiate_from_them:
    "who_are_your_top_3_competitors_how_do_you_differentiate_from_them",
  do_you_manufacture_products_internal_or_contract_manufacturing__or_are_you_a_reseller_distributor:
    "do_you_manufacture_products_internal_or_contract_manufacturing__or_are_you_a_reseller_distributor",
  what_sales_channels_do_you_operate__online__retail__marketplaces__phone_calls__etc_:
    "what_sales_channels_do_you_operate__online__retail__marketplaces__phone_calls__etc_",
  main_product_categories_and_how_many_categories_products_do_you_have:
    "main_product_categories_and_how_many_categories_products_do_you_have",
  are_you_primarily_selling_physical_products_digital_products_services_or_a_mix:
    "are_you_primarily_selling_physical_products_digital_products_services_or_a_mix",
  do_you_manage_multiple_brands_or_storefronts__multiple_websites:
    "do_you_manage_multiple_brands_or_storefronts__multiple_websites",
  who_is_the_primary_target_audience_for_your_products_or_services:
    "who_is_the_primary_target_audience_for_your_products_or_services",
  how_many_different_customer_groups_do_you_have__and_do_they_see_different_prices_or_products:
    "how_many_different_customer_groups_do_you_have__and_do_they_see_different_prices_or_products",
  what_is_your_current_technology_stack__and_what_challenges_do_you_face_with_it:
    "what_is_your_current_technology_stack__and_what_challenges_do_you_face_with_it",
  what_s_working_well_on_your_current_systems_processes_that_you_would_like_to_preserve:
    "what_s_working_well_on_your_current_systems_processes_that_you_would_like_to_preserve",
  what_are_the_languages_currencies_used_or_proposed_to_be_used:
    "what_are_the_languages_currencies_used_or_proposed_to_be_used",
  what_are_your_biggest_user_experience_challenges_with_your_current_website:
    "what_are_your_biggest_user_experience_challenges_with_your_current_website",
  what_feedback_have_you_received_from_customers_about_your_current_website:
    "what_feedback_have_you_received_from_customers_about_your_current_website",
  are_you_planning_a_rebrand_or_visual_refresh_as_part_of_this_project:
    "are_you_planning_a_rebrand_or_visual_refresh_as_part_of_this_project",
  are_there_any_unique_things_about_how_your_business_works_or_how_you_sell:
    "are_there_any_unique_things_about_how_your_business_works_or_how_you_sell",
  how_many_sales_orders_does_your_organization_generate_monthly:
    "how_many_sales_orders_does_your_organization_generate_monthly",
  what_is_your_current_conversion_rate_and_average_order_value:
    "what_is_your_current_conversion_rate_and_average_order_value",
  do_your_sales_fluctuate_seasonally: "do_your_sales_fluctuate_seasonally",
  do_you_have_any_specific_website_speed_and_performance_expectations:
    "do_you_have_any_specific_website_speed_and_performance_expectations",
  what_s_your_current_marketing_strategy__and_how_do_you_acquire_customers:
    "what_s_your_current_marketing_strategy__and_how_do_you_acquire_customers",
  what_s_your_biggest_challenge_with_online_customer_acquisition_and_retention:
    "what_s_your_biggest_challenge_with_online_customer_acquisition_and_retention",
  what_digital_marketing_channels_are_you_currently_using_to_drive_traffic:
    "what_digital_marketing_channels_are_you_currently_using_to_drive_traffic",
  which_platforms_or_campaigns_have_been_most_effective:
    "which_platforms_or_campaigns_have_been_most_effective",
  how_do_you_currently_track_and_measure_your_website_and_marketing_performance:
    "how_do_you_currently_track_and_measure_your_website_and_marketing_performance",
  what_tools_are_currently_in_your_marketing_tech_stack_crm_email_platform_cms_analytics_etc:
    "what_tools_are_currently_in_your_marketing_tech_stack_crm_email_platform_cms_analytics_etc",
  what_are_your_top_marketing_priorities_this_quarter_or_year:
    "what_are_your_top_marketing_priorities_this_quarter_or_year",
  which_kpis_matter_most_to_you_right_now:
    "which_kpis_matter_most_to_you_right_now",
  are_you_on_track_to_meet_those_kpis_if_not_what_s_getting_in_the_way:
    "are_you_on_track_to_meet_those_kpis_if_not_what_s_getting_in_the_way",
  do_you_have_a_defined_brand_bible_or_voice_guidelines:
    "do_you_have_a_defined_brand_bible_or_voice_guidelines",
  what_s_not_working_in_your_marketing_today_that_you_d_like_to_improve:
    "what_s_not_working_in_your_marketing_today_that_you_d_like_to_improve",
  if_you_had_a_magic_wand__what_would_your_ideal_marketing_setup_look_like_in_6_months:
    "if_you_had_a_magic_wand__what_would_your_ideal_marketing_setup_look_like_in_6_months",
  do_you_have_internal_resources_for_creative__ux__and_digital_marketing__or_would_you_need_support:
    "do_you_have_internal_resources_for_creative__ux__and_digital_marketing__or_would_you_need_support",
  what_is_your_content_creation_process_and_cadence:
    "what_is_your_content_creation_process_and_cadence",
  do_you_need_help_with_content_strategy__and_seo:
    "do_you_need_help_with_content_strategy__and_seo",
  what_systems_processes_or_tools_do_you_use_to_manage_sales_tax_and_compliance_today:
    "what_systems_processes_or_tools_do_you_use_to_manage_sales_tax_and_compliance_today",
  do_you_have_specific_compliance_or_regulatory_requirements_or_industry_specific_needs:
    "do_you_have_specific_compliance_or_regulatory_requirements_or_industry_specific_needs",
  are_there_any_accessibility_standards_your_website_must_comply_with:
    "are_there_any_accessibility_standards_your_website_must_comply_with",
  which_systems_absolutely_must_integrate_with_your_new_platform_versus_which_would_be_nice_to_have:
    "which_systems_absolutely_must_integrate_with_your_new_platform_versus_which_would_be_nice_to_have",
  what_erp_or_back_office_systems_do_you_use__and_how_well_do_they_integrate_with_your_current_platfo:
    "what_erp_or_back_office_systems_do_you_use__and_how_well_do_they_integrate_with_your_current_platfo",
  how_do_you_handle_data_synchronization_across_systems_today_for_inventory__orders__pricing__and_cus:
    "how_do_you_handle_data_synchronization_across_systems_today_for_inventory__orders__pricing__and_cus",
  what_systems_are_you_using_for_warehouse_or_supply_chain_management:
    "what_systems_are_you_using_for_warehouse_or_supply_chain_management",
  what_s_your_biggest_frustration_with_how_your_current_systems_work_together:
    "what_s_your_biggest_frustration_with_how_your_current_systems_work_together",
  how_do_you_currently_handle_inventory_and_order_fulfillment_in_house_dropship_3pl_or_a_combination:
    "how_do_you_currently_handle_inventory_and_order_fulfillment_in_house_dropship_3pl_or_a_combination",
  do_you_dropship_some_products_while_fulfilling_others_in_house:
    "do_you_dropship_some_products_while_fulfilling_others_in_house",
  how_do_you_handle_backorders_and_stockouts_currently:
    "how_do_you_handle_backorders_and_stockouts_currently",
  how_do_you_currently_handle_customer_service:
    "how_do_you_currently_handle_customer_service",
  walk_me_through_your_most_complicated_sale_from_quote_to_delivery_what_systems_touch_this_process:
    "walk_me_through_your_most_complicated_sale_from_quote_to_delivery_what_systems_touch_this_process",
  how_many_team_members_are_involved_in_managing_your_online_store:
    "how_many_team_members_are_involved_in_managing_your_online_store",
  do_you_have_internal_it_support_available__if_not__do_you_outsource_it:
    "do_you_have_internal_it_support_available__if_not__do_you_outsource_it",
  what_are_your_goals_for_moving_to__new_platform:
    "what_are_your_goals_for_moving_to__new_platform",
  how_will_you_measure_success_of_this_project:
    "how_will_you_measure_success_of_this_project",
  do_you_have_prior_experience_with_similar_projects:
    "do_you_have_prior_experience_with_similar_projects",
  do_you_have_assigned_resources_for_this_project:
    "do_you_have_assigned_resources_for_this_project",
  what_support_would_you_need_post_go_live__tech_support__website_maintenance__content_strategy__conv:
    "what_support_would_you_need_post_go_live__tech_support__website_maintenance__content_strategy__conv",
  are_there_any_non_negotiable_deadlines_we_need_to_work_around___like_seasonal_sales__contract_renew:
    "are_there_any_non_negotiable_deadlines_we_need_to_work_around___like_seasonal_sales__contract_renew",
  how_prepared_is_your_organization_for_change__are_there_any_internal_blockers_to_adoption:
    "how_prepared_is_your_organization_for_change__are_there_any_internal_blockers_to_adoption",
  are_there_any_concerns_about_training_or_onboarding_internal_users_to_the_new_system_:
    "are_there_any_concerns_about_training_or_onboarding_internal_users_to_the_new_system_",
  what_does_a_successful_partnership_look_like_to_you:
    "what_does_a_successful_partnership_look_like_to_you",
  what_s_your_budget_range_for_this_project:
    "what_s_your_budget_range_for_this_project",
  who_signs_the_contract_and_approves_payments:
    "who_signs_the_contract_and_approves_payments",
  who_will_be_the_project_manager_on_your_side:
    "who_will_be_the_project_manager_on_your_side",
  what_s_your_vendor_evaluation_and_selection_process:
    "what_s_your_vendor_evaluation_and_selection_process",
  are_you_evaluating_other_vendors_solutions:
    "are_you_evaluating_other_vendors_solutions",
  commerce_bdr: "commerce_bdr",
  presales: "presales",
  product_sales: "product_sales",
  commerce_sales: "commerce_sales",
  solutioning___sa_dev_creatives_: "solutioning___sa_dev_creatives_",
};

export async function salesDiscoveryFormSubmit(req, res, next) {
  try {
    const formData = req.body;

    const dealId = formData.dealId;
    if (!dealId) {
      return res.status(400).json({ message: "Missing dealId in form data." });
    }

    const deal = await getDealById(dealId, ["dealname"]);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found." });
    }

    // 3. Build and filter properties object for HubSpot
    const properties = {};
    for (const [fieldKey, hsKey] of Object.entries(propertyMap)) {
      let value = formData[fieldKey];

      if (Array.isArray(value)) {
        value = value.join(";");
      }

      // Only include non-null, non-empty values
      if (value != null && value !== "") {
        properties[hsKey] = value;
      }
    }

    // 4. If no properties to update, return early
    if (Object.keys(properties).length === 0) {
      return res.status(404).json({
        success: true,
        message: "No form fields were filled out. No update required.",
        data: formData,
      });
    }


    // Update HubSpot deal
    const updateResult = await updateDealById(dealId, properties);
    if (!updateResult || updateResult.error) {
      return res.status(500).json({
        message: "Failed to update deal in HubSpot.",
        error: updateResult?.error,
      });
    }

    res.json({ message: "Form submitted successfully", data: formData });
  } catch (err) {
    next(err);
  }
}
