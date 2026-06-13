import "./env.js";

import app from "./app.js";

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});
