import { useState, useEffect } from "react" // Import des hooks useState et useEffect pour gérer l'état et les effets
import { useRouter } from "next/router" // Import du hook useRouter pour la navigation
import HeaderTechnicien from "../components/HeaderTechnicien" // Import du header pour les techniciens
import HeaderAdministrateur from "../components/HeaderAdministrateur" // Import du header pour les administrateurs
import styles from "../styles/PersonalTicketsList.module.css" // Import du fichier CSS pour styliser la liste des tickets personnels

//  Composant principal affichant les tickets assignés à l'utilisateur
const personalTicketsList = () => {
  const [tickets, setTickets] = useState([]) // Stocke la liste des tickets récupérés
  const [loading, setLoading] = useState(true) // Gère l'affichage du chargement
  const [error, setError] = useState("") // Stocke les erreurs éventuelles
  const [userRole, setUserRole] = useState(null) // Stocke le rôle de l'utilisateur
  const [userId, setUserId] = useState(null) // Stocke l'ID de l'utilisateur connecté
  const router = useRouter() // Initialise le routeur pour la navigation

  useEffect(() => {
    //  Récupère le rôle et l'ID de l'utilisateur stockés dans localStorage
    const storedRole = localStorage.getItem("role")
    const storedUser = localStorage.getItem("user")

    if (storedRole) setUserRole(storedRole) // Met à jour l'état avec le rôle

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) // Convertit la chaîne JSON en objet JavaScript
        setUserId(user.id) // Stocke l'ID de l'utilisateur

        //  Si l'utilisateur a un ID, on récupère ses tickets assignés
        if (user.id) fetchUserTickets(user.id)
      } catch (err) {
        console.error("Erreur lors du parsing des informations utilisateur:", err)
        setError("Erreur lors de la récupération des informations utilisateur") // Définit le message d'erreur
        setLoading(false) // Arrête l'affichage du chargement
      }
    }
  }, []) // Exécuté une seule fois au chargement du composant

  //  Fonction asynchrone pour récupérer les tickets assignés à l'utilisateur
  const fetchUserTickets = async (userId) => {
    try {
      setLoading(true) // Active l'état de chargement
      console.log("[personalTicketsList] Récupération des tickets pour l'utilisateur:", userId)

      //  Effectue une requête pour récupérer les tickets assignés à l'utilisateur
      const response = await fetch(`https://tickevo-backend.vercel.app/ticketsTechnicien/assigned/${userId}`, {
        method: "GET", // Requête GET pour récupérer les tickets
        headers: {
          "Content-Type": "application/json", // Indique que les données envoyées et reçues sont au format JSON
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ajoute le token pour l'authentification
        },
      })

      if (!response.ok) throw new Error(`Erreur lors de la récupération des tickets: ${response.status}`)

      const data = await response.json() // Convertit la réponse en JSON
      console.log("[personalTicketsList] Tickets récupérés:", data)

      if (!data.tickets) {
        console.error("[personalTicketsList] Format de réponse inattendu:", data)
        setTickets([]) // Définit la liste des tickets à vide
        return
      }

      setTickets(data.tickets) //  Stocke les tickets récupérés
    } catch (err) {
      console.error("[personalTicketsList] Erreur:", err)
      setError(`Erreur: ${err.message}`) // Stocke le message d'erreur
    } finally {
      setLoading(false) // Désactive l'affichage du chargement
    }
  }

  if (loading)
    return (
      <div className={styles.container}>
        {/*  Affichage dynamique du bon Header selon le rôle */}
        {userRole === "Administrateur" ? <HeaderAdministrateur /> : userRole === "Technicien" ? <HeaderTechnicien /> : null}
        <div className={styles.loading}>Chargement des tickets...</div> {/* Affichage du message de chargement */}
      </div>
    )

  if (error)
    return (
      <div className={styles.container}>
        {/*  Affichage dynamique du bon Header selon le rôle */}
        {userRole === "Administrateur" ? <HeaderAdministrateur /> : userRole === "Technicien" ? <HeaderTechnicien /> : null}
        <div className={styles.error}>Erreur : {error}</div> {/* Affichage du message d'erreur */}
      </div>
    )

  return (
    <div className={styles.container}>
      {/*  Affichage dynamique du bon Header selon le rôle */}
      {userRole === "Administrateur" ? <HeaderAdministrateur /> : userRole === "Technicien" ? <HeaderTechnicien /> : null}

      <div className={styles.content}>
        <h2 className={styles.title}>Mes tickets</h2>

        <div className={styles.ticketsContainer}>
          {tickets.length === 0 ? (
            <p className={styles.noTickets}>Aucun ticket assigné.</p> //  Affichage si aucun ticket n'est trouvé
          ) : (
            <table className={styles.ticketsTable}> {/*  Affichage des tickets sous forme de tableau */}
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Date</th>
                  <th>Catégorie</th>
                  <th>Titre</th>
                  <th>Créé par</th>
                  <th>Statut</th>
                  <th>Assigné à</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.ticketNumber}</td> {/*  Affiche le numéro du ticket */}
                    <td>{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</td> {/*  Affiche la date de création */}
                    <td>{ticket.category || "Demande"}</td> {/*  Affiche la catégorie du ticket */}
                    <td>{ticket.title}</td> {/*  Affiche le titre du ticket */}
                    <td>{ticket.userId?.username || "Inconnu"}</td> {/*  Affiche le créateur du ticket */}
                    <td>
                      {/*  Affichage du statut avec un style différent */}
                      {ticket.status === "clôturé" ? (
                        <span className={styles.closedLabel}>clôturé</span>
                      ) : ticket.status === "en cours" ? (
                        <span className={styles.inProgressLabel}>en cours</span>
                      ) : (
                        <span className={styles.pendingLabel}>en attente</span>
                      )}
                    </td>
                    <td>{ticket.assignedTo ? ticket.assignedTo.username : "Non assigné"}</td> {/*  Affiche le technicien assigné */}
                    <td>
                      <button
                        className={styles.viewButton}
                        onClick={() => router.push(`/treatmentTicket?ticketId=${ticket._id}`)} //  Redirection vers la page du ticket
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default personalTicketsList //  Exporte le composant pour être utilisé ailleurs
