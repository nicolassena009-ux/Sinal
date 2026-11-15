import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/Experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sinal — Reconhecer também é proteger" },
      {
        name: "description",
        content:
          "Aprenda a reconhecer situações de emergência, entenda o que fazer e descubra como agir quando cada segundo importa. Engasgo, convulsão, parada cardiorrespiratória, queimadura e trauma.",
      },
      { property: "og:title", content: "Sinal — Reconhecer também é proteger" },
      {
        property: "og:description",
        content:
          "Uma experiência interativa para aprender a reconhecer, entender, agir e proteger em situações de emergência.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});
