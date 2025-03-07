import React, { useEffect, useState } from "react";

const LastTickets = () => {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token"); // ✅ Récupère le token stocké

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/tickets/last", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Ajoute le token dans le header
          },
        });

        if (!response.ok) {
          throw new Error(
            `Erreur API: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setTickets(data); // ✅ Met à jour l'état avec les tickets récupérés
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des tickets :", error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Mes derniers tickets</h2>
      <ul>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <li key={ticket._id}>
              <strong>{ticket.title}</strong> - {ticket.status} (Créé le :{" "}
              {new Date(ticket.createdAt).toLocaleString()})
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
