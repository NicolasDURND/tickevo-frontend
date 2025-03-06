import React, { useEffect, useState } from "react";

const LastTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/tickets/last") // ✅ Correction : pas de "api/"
      .then((response) => response.json())
      .then((data) => setTickets(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des tickets :", error)
      );
  }, []);

  return (
    <div>
      <h2>Derniers tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <strong>{ticket.title}</strong> - {ticket.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LastTickets;
