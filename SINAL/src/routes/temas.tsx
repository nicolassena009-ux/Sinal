import { createFileRoute } from "@tanstack/react-router";
import { GaleriaTemas } from "@/components/GaleriaTemas";

export const Route = createFileRoute("/temas")({
  head: () => ({
    meta: [
      { title: "Explorar os Temas — Sinal" },
      {
        name: "description",
        content:
          "Explore os temas de emergência e primeiros socorros em 3D interativo: Engasgo, Convulsão, Parada cardiorrespiratória, Queimadura e Trauma.",
      },
      { property: "og:title", content: "Explorar os Temas — Sinal" },
      {
        property: "og:description",
        content:
          "Explore os temas de emergência e primeiros socorros em 3D interativo: Engasgo, Convulsão, Parada cardiorrespiratória, Queimadura e Trauma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaleriaTemas,
});
