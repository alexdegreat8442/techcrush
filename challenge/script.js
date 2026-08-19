const SUPABASE_URL = "https://drilkkslcvfbwhhgkfbo.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_Hkm47akggqbaBdOkukx1-Q_Csj0rrKQ";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  const button = document.getElementById("submitButton");
  const message = document.getElementById("message");

  if (!form || !button || !message) {
    console.error(
      "Missing HTML element. Check leadForm, submitButton, and message IDs."
    );
    return;
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    button.disabled = true;
    button.textContent = "Submitting...";
    message.textContent = "";
    message.className = "";

    const formData = new FormData(form);

    const getText = (name) =>
      String(formData.get(name) || "").trim();

    const lead = {
      full_name: getText("full_name"),
      email: getText("email"),
      phone: getText("phone"),
      company_name: getText("company_name"),
      service_interest: getText("service_interest"),
      estimated_budget: getText("estimated_budget"),
      start_timeline: getText("start_timeline"),
      inquiry_message: getText("inquiry_message"),
      preferred_contact_method: getText("preferred_contact_method"),
      status: "new",
      email_sent: false
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=representation"
        },
        body: JSON.stringify(lead)
      });

      const result = await response.text();

      console.log("Supabase status:", response.status);
      console.log("Supabase response:", result);

      if (!response.ok) {
        throw new Error(result || "Supabase rejected the submission.");
      }

      form.reset();
      showMessage(
        "Thank you. Your inquiry was submitted successfully.",
        "success"
      );
    } catch (error) {
      console.error("Submission error:", error);

      showMessage(
        `Submission failed: ${error.message}`,
        "error"
      );
    } finally {
      button.disabled = false;
      button.textContent = "Submit inquiry";
    }
  });
});