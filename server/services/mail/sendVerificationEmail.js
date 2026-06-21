  // src/services/mail/sendVerificationEmail.js

  import { getResend } from "./resendClient.js";

  export const sendVerificationEmail = async ({ email, code }) => {
    const { data, error } = await getResend().emails.send({
      from: "Salon de beauté <onboarding@resend.dev>",
      to: email,
      subject: "Votre code de confirmation 🔐",
      html: `
    <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #E6DDD0; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #f3ede4; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); overflow: hidden;">

        <!-- Header -->
        <div style="background-color: #4F684B; padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 1.6rem; font-weight: 700; letter-spacing: 1px;">🔐 Code de vérification</h1>
        </div>

        <!-- Body -->
        <div style="padding: 2rem;">
          <p style="color: #6A3E37; font-size: 1rem;">
            Bonjour, voici votre code pour confirmer votre rendez-vous :
          </p>

          <!-- Code block -->
          <div style="background-color: rgba(201, 166, 160, 0.2); border-left: 4px solid #4F684B; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
            <p style="margin: 0; font-size: 2.5rem; color: #4F684B; font-weight: 700; letter-spacing: 8px;">${code}</p>
          </div>

          <p style="color: #6A3E37; font-size: 0.9rem;">⏱️ Ce code est valide pendant <b>10 minutes</b>.</p>
          <p style="color: #6A3E37; font-size: 0.9rem;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3ede4; padding: 1rem; text-align: center; border-top: 1px solid rgba(79, 104, 75, 0.15);">
          <p style="color: #C9A6A0; font-size: 0.8rem; margin: 0;">Salon de beauté · Ne pas répondre à cet email</p>
        </div>

      </div>
    </div>
      `,
    });

    if (error) throw error;
    return data;
  };
