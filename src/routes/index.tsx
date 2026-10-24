import { createFileRoute } from "@tanstack/react-router";
import { IntroLoader } from "@/components/portfolio/IntroLoader";
import { SiteHeader } from "@/components/portfolio/SiteHeader";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Experience } from "@/components/portfolio/Experience";
import { RibbonGallery } from "@/components/portfolio/RibbonGallery";
import { WorksRing } from "@/components/portfolio/WorksRing";
import { Services } from "@/components/portfolio/Services";
import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dagmawi Tewodros — Software Developer" },
      {
        name: "description",
        content:
          "Portfolio of Dagmawi Tewodros, a software developer building modern web and mobile applications with clean architecture and thoughtful design.",
      },
      { property: "og:title", content: "Dagmawi Tewodros — Software Developer" },
      {
        property: "og:description",
        content:
          "Portfolio of Dagmawi Tewodros, a software developer building modern web and mobile applications.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="portfolio min-h-screen bg-[#0a0a0a]">
      <IntroLoader />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Experience />
        <RibbonGallery />
        <WorksRing />
        <Services />
        <Contact />
      </main>
    </div>
  );
}
