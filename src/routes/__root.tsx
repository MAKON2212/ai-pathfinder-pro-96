import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { MeshBackground } from "@/components/MeshBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-7xl font-medium tracking-tighter">404</h1>
        <h2 className="mt-4 text-xl font-medium">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ScanAI — Personal AI roadmap for your business" },
      {
        name: "description",
        content:
          "ScanAI shows you in 3 minutes how much AI can deliver to your business. With a personal report and a concrete 90-day plan.",
      },
      { property: "og:title", content: "ScanAI — Personal AI roadmap for your business" },
      {
        property: "og:description",
        content: "Personal AI roadmap & value analysis for your business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "ScanAI — Personal AI roadmap for your business" },
      { name: "description", content: "ScanAI 2 offers businesses an AI strategy assessment and tool recommendations." },
      { property: "og:description", content: "ScanAI 2 offers businesses an AI strategy assessment and tool recommendations." },
      { name: "twitter:description", content: "ScanAI 2 offers businesses an AI strategy assessment and tool recommendations." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/68c0f82d-d4f6-4705-8d42-bf447df71cba/id-preview-f1473f6a--19fa5cb1-a805-4773-ad66-ea0ea7129942.lovable.app-1777623786172.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/68c0f82d-d4f6-4705-8d42-bf447df71cba/id-preview-f1473f6a--19fa5cb1-a805-4773-ad66-ea0ea7129942.lovable.app-1777623786172.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-transparent text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <CustomCursor />
      <MeshBackground />
      <Navbar />
      <main className="pt-20 md:pt-28">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
