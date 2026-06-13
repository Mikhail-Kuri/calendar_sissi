import { getResend } from "../../../src/services/mail/resendClient.js";

export const sendConfirmationEmail = async ({ email, start, end, name }) => {
  const formattedDate = new Date(start).toLocaleString("fr-CA", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const formattedEnd = new Date(end).toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data, error } = await getResend().emails.send({
    from: "Salon de beauté <onboarding@resend.dev>",
    to: email,
    subject: "Confirmation de votre rendez-vous ✨",

    html: `
  <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #E6DDD0; padding: 40px 20px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #f3ede4; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); overflow: hidden;">

      <!-- Header -->
      <div style="background-color: #4F684B; padding: 2rem; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 1.6rem; font-weight: 700; letter-spacing: 1px;">✨ Rendez-vous confirmé</h1>
      </div>

      <!-- Body -->
      <div style="padding: 2rem;">
        <p style="color: #6A3E37; font-size: 1rem; margin-bottom: 0.5rem;">
          Bonjour <b style="color: #4F684B;">${name || "cher client"}</b>,
        </p>
        <p style="color: #6A3E37;">Votre rendez-vous est confirmé pour :</p>

        <!-- Date block -->
        <div style="background-color: rgba(201, 166, 160, 0.2); border-left: 4px solid #4F684B; border-radius: 12px; padding: 1rem 1.5rem; margin: 1.5rem 0;">
          <p style="margin: 0; font-size: 1.1rem; color: #4F684B; font-weight: 700;">${formattedDate}</p>
          <p style="margin: 0.5rem 0 0; color: #6A3E37; font-size: 0.95rem;">Jusqu'à ${formattedEnd}</p>
        </div>

        <p style="color: #6A3E37;">Nous avons hâte de vous voir 💅</p>

        <div style="text-align: center; margin-top: 2rem;">
          <span style="display: inline-block; background-color: #4F684B; color: white; padding: 0.7rem 2rem; border-radius: 30px; font-size: 1rem; font-weight: 600; box-shadow: 0 6px 16px rgba(79, 104, 75, 0.25);">
            À bientôt 👋
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f3ede4; padding: 1rem; text-align: center; border-top: 1px solid rgba(79, 104, 75, 0.15);">
        <p style="color: #C9A6A0; font-size: 0.8rem; margin: 0;">Salon de beauté · Ne pas répondre à cet email</p>
      </div>

    </div>
  </div>
`,
  });

  if (error) {
    throw error;
  }

  return data;
};
