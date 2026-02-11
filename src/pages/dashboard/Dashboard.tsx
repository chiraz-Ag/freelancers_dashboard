import React, { useState } from "react";
import SideMenu from "../../components/SideMenu"; // Chemin vers SideMenu
import Overview from "./overview"; // Chemin vers Overview
import Data from "./data/Data"; // Chemin vers Data
import Performance from "./performance"; // Chemin vers Performance
import Revenus from "./Revenus"; // Nouvelle section
import Fidelisation from "./Fidelisation"; // Nouvelle section
import Marketing from "./Marketing"; // Nouvelle section

const Dashboard = () => {
  // État pour gérer la section active
  const [activeSection, setActiveSection] = useState("overview"); // Par défaut, afficher "Overview"

  // Fonction pour changer la section active
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Side Menu */}
      <SideMenu onSectionChange={handleSectionChange} />

      {/* Contenu principal */}
      <div
        style={{
          flex: 1,
          marginLeft: "240px", // Espace pour le Side Menu
          marginTop: "64px", // Espace pour l'AppBar
          padding: "20px",
        }}
      >
        {activeSection === "overview" && <Overview />}
        {activeSection === "data" && <Data />}
        {activeSection === "performance" && <Performance />}
        {activeSection === "revenus" && <Revenus />}
        {activeSection === "fidelisation" && <Fidelisation />}
        {activeSection === "marketing" && <Marketing />}
      </div>
    </div>
  );
};

export default Dashboard;
// pages/dashboard/index.tsx
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DashboardIndex() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // tant que la session charge, on attend
    if (status === "authenticated") {
      router.replace("/dashboard/overview"); // redirection automatique vers Overview
    } else {
      router.replace("/signin"); // sinon vers la page de login
    }
  }, [status, router]);

  return null; // aucun rendu, on redirige immédiatement
}
