import React from "react";
import DemandeTickets from "../components/DemandeTickets.js";
import HeaderUser from "../components/HeaderTechnicien";

function Index() {
  return (
    <div>
      <HeaderUser />
      <DemandeTickets />
    </div>
  );
}

export default Index;
