export const fetchAppointments = async (from, to) => {
    try {

        const url = new URL("http://localhost:5000/appointments");

        if (from) url.searchParams.append("from", from);
        if (to) url.searchParams.append("to", to);

        // 👇 ICI : CHECK CACHE (avant fetch)

        const res = await fetchWithTimeout(url, {}, 8000);

        if (!res.ok) {
            console.error("Erreur HTTP :", res.status);
            return [];
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("Réponse invalide (pas un tableau) :", data);
            return [];
        }

        console.log("Données récupérées :", data);

        const currentUserId = localStorage.getItem("userId");
        let myEventIds = JSON.parse(localStorage.getItem(currentUserId) || "[]");

        const userStillHasEvent = data.some(event =>
            myEventIds.includes(event.id)
        );

        if (!userStillHasEvent && currentUserId) {
            localStorage.removeItem(currentUserId);

            const newUserId = crypto.randomUUID();
            localStorage.setItem(newUserId, JSON.stringify([]));
            localStorage.setItem("userId", newUserId);

            myEventIds = [];
        }

        const processedEvents = data
            .filter(event => {
                const isMine = myEventIds.includes(event.id);
                const isPrivate = event.visibility === "private";
                return !isPrivate || isMine;
            })
            .map(event => {
                const isMine = myEventIds.includes(event.id);

                return {
                    ...event,
                    display: "auto",
                    color: isMine ? "#b85c9e" : "#ff3b3b",
                    title: isMine ? event.title : "Période indisponible",
                };
            });

        // 👇 ICI : STORE CACHE (avant return)
        return processedEvents;

    } catch (err) {
          if (err.name === "AbortError") {
              console.error("Timeout: le serveur a pris trop de temps");
          } else {
              console.error("Erreur de chargement :", err);
          }
         throw err;
      }
};

function fetchWithTimeout(url, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return fetch(url, {
        ...options,
        signal: controller.signal,
    }).finally(() => clearTimeout(id));
}