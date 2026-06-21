// src/services/mail/sendVerificationEmail.js

import { getResend } from "./resendClient.js";

export const sendVerificationEmail = async ({ email, code }) => {
  const { data, error } = await getResend().emails.send({
    from: "Sissi <onboarding@resend.dev>",
    to: email,
    subject: "Votre code de confirmation",
    html: `
  <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #faf9f7; padding: 40px 20px;">
    <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">

      <!-- Header -->
      <div style="background: linear-gradient(155deg, #2d3d29 0%, #4f684b 100%); padding: 36px 32px 32px; text-align: center;">
        <p style="font-family: 'Playfair Display', Georgia, serif; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; margin: 0 0 16px;">Sissi</p>
        <span style="display: inline-block; background-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.9); font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; border-radius: 20px; padding: 5px 14px; margin-bottom: 14px;">Vérification</span>
        <h1 style="color: #ffffff; margin: 0; font-size: 21px; font-weight: 600; line-height: 1.3;">Code de vérification</h1>
      </div>

      <!-- Body -->
      <div style="padding: 32px;">
        <p style="color: #5a4a44; font-size: 15px; margin: 0 0 4px; line-height: 1.6;">
          Voici votre code pour confirmer votre rendez-vous :
        </p>

        <!-- Code block -->
        <div style="background-color: #f0ece5; border-left: 4px solid #2d3d29; border-radius: 12px; padding: 22px; margin: 22px 0; text-align: center;">
          <p style="margin: 0; font-size: 38px; color: #2d3d29; font-weight: 700; letter-spacing: 8px;">${code}</p>
        </div>

        <p style="color: #8a7c74; font-size: 13px; margin: 0 0 6px;">Ce code est valide pendant <b style="color: #5a4a44;">10 minutes</b>.</p>
        <p style="color: #8a7c74; font-size: 13px; margin: 0;">Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.</p>
      </div>

      <!-- Footer -->
      <div style="background-color: #faf9f7; padding: 18px; text-align: center; border-top: 1px solid rgba(79, 104, 75, 0.12);">
        <p style="color: #9c867c; font-size: 11.5px; margin: 0; letter-spacing: 0.2px;">Sissi · Ne pas répondre à cet email</p>
      </div>

    </div>
  </div>
    `,
  });

  if (error) throw error;
  return data;
};
