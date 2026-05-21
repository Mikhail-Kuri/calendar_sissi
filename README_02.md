SETUP GOOGLE CALENDAR AVEC SERVICE ACCOUNT (APP DE RENDEZ-VOUS)

1. Créer un projet Google Cloud
- Aller sur https://console.cloud.google.com
- Créer un nouveau projet

2. Activer Google Calendar API
- APIs & Services
- Library
- Rechercher "Google Calendar API"
- Cliquer sur Enable

3. Créer un Service Account
- IAM & Admin
- Service Accounts
- Create Service Account

Google crée une adresse comme :
mon-service@mon-projet.iam.gserviceaccount.com

4. Générer une clé JSON
- Ouvrir le Service Account
- Onglet Keys
- Add Key
- Create New Key
- JSON

Télécharger le fichier JSON.

Ce fichier contient :
- private_key
- client_email
- project_id
- etc.

IMPORTANT :
- Ne jamais commit le JSON sur GitHub
- Garder le fichier secret

5. Partager le calendrier Google avec le Service Account
- Ouvrir Google Calendar
- Settings du calendrier
- Share with specific people

Ajouter :
mon-service@mon-projet.iam.gserviceaccount.com

Permissions :
- Make changes to events

IMPORTANT :
Sans ce partage, le service account ne peut pas accéder au calendrier.

6. Installer googleapis dans le serveur Node.js

npm install googleapis

7. Utiliser le JSON dans le backend

Exemple :

const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: [
    "https://www.googleapis.com/auth/calendar"
  ],
});

8. Créer un client Google Calendar

const calendar = google.calendar({
  version: "v3",
  auth,
});

9. Créer un rendez-vous

await calendar.events.insert({
  calendarId: "primary",
  requestBody: {
    summary: "Rendez-vous client",
    start: {
      dateTime: "2026-05-21T10:00:00-04:00",
    },
    end: {
      dateTime: "2026-05-21T11:00:00-04:00",
    },
  },
});

10. Fonctionnement général

Client Web
   ↓
Backend API
   ↓
Service Account Google
   ↓
Google Calendar API
   ↓
Calendrier Google partagé

Le serveur agit comme un bot automatique qui peut :
- créer des événements
- modifier des rendez-vous
- supprimer des événements
- lire les disponibilités

Aucun login Google utilisateur n’est nécessaire si :
- le calendrier est déjà partagé avec le service account.

Le service account agit comme une identité machine/backend.