DEPLOIEMENT APP DE RENDEZ-VOUS AVEC VERCEL + GOOGLE CALENDAR

OBJECTIF
- Héberger le frontend gratuitement
- Héberger les fonctions backend gratuitement
- Utiliser Google Calendar pour les rendez-vous
- Ne PAS payer un VPS/serveur

==================================================
1. CREER LE PROJET NEXT.JS
==================================================

Créer le projet :

npx create-next-app@latest

Entrer dans le projet :

cd mon-projet

Installer Google API :

npm install googleapis

==================================================
2. CREER LES FONCTIONS SERVERLESS
==================================================

Créer :

/app/api/book-appointment/route.js

Exemple :

import { google } from "googleapis";

export async function POST(req) {

   const body = await req.json();

   const auth = new google.auth.GoogleAuth({
      credentials: {
         client_email:
            process.env.GOOGLE_CLIENT_EMAIL,

         private_key:
            process.env.GOOGLE_PRIVATE_KEY.replace(
               /\\n/g,
               "\n"
            ),
      },

      scopes: [
         "https://www.googleapis.com/auth/calendar",
      ],
   });

   const calendar = google.calendar({
      version: "v3",
      auth,
   });

   await calendar.events.insert({
      calendarId:
         process.env.GOOGLE_CALENDAR_ID,

      requestBody: {
         summary: body.name,

         start: {
            dateTime: body.start,
         },

         end: {
            dateTime: body.end,
         },
      },
   });

   return Response.json({
      success: true,
   });
}

==================================================
3. TESTER LOCALEMENT
==================================================

Lancer :

npm run dev

Tester :

http://localhost:3000/api/book-appointment

==================================================
4. CONFIGURER GOOGLE CLOUD
==================================================

1. Aller sur :
https://console.cloud.google.com

2. Créer un projet

3. Activer :
Google Calendar API

4. Créer un Service Account

5. Générer une clé JSON

6. Copier :
- client_email
- private_key

==================================================
5. PARTAGER LE CALENDRIER
==================================================

Dans Google Calendar :

Settings
→ Share with specific people

Ajouter :

mon-service-account@project.iam.gserviceaccount.com

Permission :

Make changes to events

==================================================
6. TROUVER LE CALENDAR ID
==================================================

Google Calendar
→ Settings
→ Integrate calendar

Copier :

Calendar ID

==================================================
7. AJOUTER VARIABLES D’ENVIRONNEMENT
==================================================

Dans Vercel :

Project Settings
→ Environment Variables

Ajouter :

GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=

IMPORTANT :
Ne jamais mettre service-account.json sur GitHub.

==================================================
8. PUSH SUR GITHUB
==================================================

git init

git add .

git commit -m "init"

git remote add origin URL_DU_REPO

git push -u origin main

==================================================
9. DEPLOYER SUR VERCEL
==================================================

1. Aller sur :
https://vercel.com

2. Login avec GitHub

3. Import Project

4. Sélectionner le repo

5. Deploy

==================================================
10. RESULTAT FINAL
==================================================

Frontend :
https://mon-site.vercel.app

API :
https://mon-site.vercel.app/api/book-appointment

==================================================
11. ARCHITECTURE FINALE
==================================================

Utilisateur
   ↓
Frontend Next.js
   ↓
Vercel Serverless Function
   ↓
Google Calendar API
   ↓
Calendrier Google

==================================================
12. AVANTAGES
==================================================

- Pas besoin de VPS
- Pas besoin d’Express
- Pas besoin de serveur Ubuntu
- Pas besoin de nginx
- Pas besoin de PM2
- Déploiement automatique GitHub
- Gratuit pour petit trafic
- Scalabilité automatique