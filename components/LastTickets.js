import React, { useEffect, useState } from "react";

const LastTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/tickets/last")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Erreur API: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => setTickets(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des tickets :", error)
      );
  }, []);

  return (
    <div>
      <h2>Derniers tickets</h2>
      <ul>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <li key={ticket._id}>
              <strong>{ticket.title}</strong> - {ticket.status} (Créé par :{" "}
              {ticket.createdBy?.username || "Anonyme"})
            </li>
          ))
        ) : (
          <p>Aucun ticket récent</p>
        )}
      </ul>
    </div>
  );
};

export default LastTickets;
