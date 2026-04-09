import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Movie } from "../types/movie";

// =============================================================
// EXERCICE 3 — MovieDetailPage (8 pts)
// =============================================================
//
// Compléter cette page pour afficher le détail d'un film
// et permettre de le marquer comme "vu".
//
// Endpoints :
//   GET  /api/movies/:id               → récupérer le détail du film
//   POST /api/movies/:id/toggle-watched → basculer vu / non vu
//
// 1. (1 pt) Récupérer l'id du film depuis l'URL
//
// 2. (2 pts) Charger les données du film avec useQuery
//
// 3. (1 pt) Afficher les informations du film :
//    titre, image, réalisateur, année, genre, description
//
// 4. (4 pts) Implémenter un bouton pour basculer "vu / non vu" :
//    - Envoyer la requête POST au bon endpoint
//    - Mettre à jour l'affichage après le succès (penser à l'invalidation)
//    - Le texte du bouton doit refléter l'état actuel
//
// Classes CSS suggérées :
//   Container :   "max-w-2xl mx-auto"
//   Image :       "w-full h-64 object-cover rounded-lg"
//   Titre :       "text-3xl font-bold mt-4"
//   Sous-titre :  "text-gray-600 mt-1"
//   Description : "text-gray-700 mt-4"
//   Bouton :      "mt-4 px-4 py-2 rounded-lg text-white"
//                 + (watched ? "bg-gray-500" : "bg-green-600")
//

const API_URL = "/api/movies";

export const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery<Movie>({
    queryKey: ["movie"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Erreur HTTP");
      return response.json();
    },
  });

  const filmToggleWatched = useMutation({
    mutationFn: async () => {
      await fetch(API_URL + '/' + data?.id + "/toggle-watched", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          watched : !data?.watched
        }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["movie"] });
    },
  });

  return (
    <div>
      <h1>Détail du film {data?.title}</h1>
      <img src={data?.imageUrl} alt={data?.title} />
      <p>{data?.director}</p>
      <p>{data?.year}</p>
      <p>{data?.genre}</p>
      <p>{data?.description}</p>

      <button onClick={() => filmToggleWatched.mutate()}>
        {data?.watched ? "vu" : "non vu"}
      </button>
    </div>
  );
};
