import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
} from "@tanstack/react-router";




import { TeddyProvider, TeddyMascote } from "@/components/TeddyMascote";
import { SiteBackground } from "@/components/SiteBackground";
import { useSiteInteractions } from "@/lib/useSiteInteractions";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Essa página não existe ou foi movida. Volte para o início do Sinal.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="press inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();


  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente novamente ou volte para o início do Sinal.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="press inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sinal — Reconhecer também é proteger" },
      {
        name: "description",
        content:
          "Plataforma educativa e interativa para aprender a reconhecer situações de emergência e saber como agir.",
      },
      { property: "og:title", content: "Sinal — Reconhecer também é proteger" },
      {
        property: "og:description",
        content:
          "Plataforma educativa e interativa para aprender a reconhecer situações de emergência e saber como agir.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const inGames = useRouterState({ select: state => state.location.pathname === "/jogos" });
  const { queryClient } = Route.useRouteContext();
  useSiteInteractions();

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-display focus:font-bold focus:text-[color:var(--roxo)] focus:shadow-lg">Pular para o conteúdo principal</a>
      <div id="conteudo-principal">
      <TeddyProvider>
      <SiteBackground />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <div className="relative z-10">
        <Outlet />
      </div>
      <div className="teddy-global print:hidden" hidden={inGames}>
        <TeddyMascote tamanho={140} mensagemInicial={null} />
      </div>
      </TeddyProvider>
      </div>
    </QueryClientProvider>
  );
}
