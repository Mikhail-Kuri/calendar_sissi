import { transporter } from "../transporter/transporter.js";

export const sendConfirmationEmail = async ({ email, start, end, name }) => {
  const formattedDate = new Date(start).toLocaleString("fr-CA", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const formattedEnd = new Date(end).toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await transporter.sendMail({
    from: `"Salon de beauté 💅" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmation de votre rendez-vous ✨",
    html: `
      <div style="font-family: Arial; padding: 10px;">
        <h2>🎉 Rendez-vous confirmé</h2>

        <p>Bonjour <b>${name || "cher client"}</b>,</p>

        <p>Votre rendez-vous est confirmé pour :</p>

        <h3>${formattedDate}</h3>
        <p>Jusqu’à ${formattedEnd}</p>

        <p>Nous avons hâte de vous voir 💅</p>

        <br/>

        <p>À bientôt 👋</p>
      </div>
    `,
  });
};
