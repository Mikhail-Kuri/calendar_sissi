// src/services/mail/sendConfirmationEmail.js

import { getResend } from "./resendClient.js";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const sendConfirmationEmail = async ({
  title,
  description,
  start,
  end,
  email,
  phone,
  breakMinute,
}) => {
  const { data, error } = await getResend().emails.send({
    from: "Sissi <onboarding@resend.dev>",
    to: email,
    subject: "Votre rendez-vous est confirmé",
    html: `
  <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #faf9f7; padding: 40px 20px;">
    <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">

      <!-- Header -->
      <div style="background: linear-gradient(155deg, #2d3d29 0%, #4f684b 100%); padding: 36px 32px 32px; text-align: center;">
        <p style="font-family: 'Playfair Display', Georgia, serif; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; margin: 0 0 16px;">Sissi</p>
        <span style="display: inline-block; background-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.9); font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; border-radius: 20px; padding: 5px 14px; margin-bottom: 14px;">Confirmation</span>
        <h1 style="color: #ffffff; margin: 0; font-size: 21px; font-weight: 600; line-height: 1.3;">Rendez-vous confirmé</h1>
      </div>

      <!-- Body -->
      <div style="padding: 32px;">
        <p style="color: #5a4a44; font-size: 15px; margin: 0 0 4px; line-height: 1.6;">
          Votre rendez-vous a bien été confirmé. Voici le récapitulatif :
        </p>

        <!-- Details block -->
        <div style="background-color: #f0ece5; border-left: 4px solid #2d3d29; border-radius: 12px; padding: 22px; margin: 22px 0;">
          <p style="margin: 0 0 10px; font-size: 14px; color: #5a4a44;">
            <span style="display: inline-block; width: 90px; color: #8a7c74;">Date</span>
            <b style="color: #2d3d29;">${formatDate(start)}</b>
          </p>
          <p style="margin: 0; font-size: 14px; color: #5a4a44;">
            <span style="display: inline-block; width: 90px; color: #8a7c74;">Horaire</span>
            <b style="color: #2d3d29;">${formatTime(start)} - ${formatTime(end)}</b>
          </p>
        </div>

        ${description ? `
        <p style="color: #5a4a44; font-size: 14px; margin: 0 0 18px; line-height: 1.6;">
          ${description}
        </p>` : ""}
      </div>

      <!-- Footer -->
      <div style="background-color: #faf9f7; padding: 18px; text-align: center; border-top: 1px solid rgba(79, 104, 75, 0.12);">
        <p style="color: #9c867c; font-size: 12px; margin: 0 0 4px;">
          Un empêchement ? Contactez-nous à
          <a href="mailto:contact@sissi.fr" style="color: #4f684b; text-decoration: none; font-weight: 600;">contact@sissi.fr</a>
        </p>
        <p style="color: #9c867c; font-size: 11.5px; margin: 0; letter-spacing: 0.2px;">Sissi · Ne pas répondre à cet email</p>
      </div>

    </div>
  </div>
    `,
  });

  if (error) throw error;
  return data;
};