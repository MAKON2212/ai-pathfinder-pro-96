import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/dev-seed")({
  component: DevSeed,
});

function DevSeed() {
  const navigate = useNavigate();
  useEffect(() => {
    const answers = {
      companyName: "Bakkerij De Korenbloem",
      industry: "E-commerce",
      size: "10-25",
      revenue: "1m-5m",
      techStack: ["Shopify", "Klaviyo"],
      painPoints: ["Klantenservice", "Repetitief admin werk", "Marketing content"],
      goals: ["Meer omzet", "Tijd besparen"],
      budget: "500-2000",
      outcome: "Snel resultaat",
      timeline: "0-3 maanden",
      website: "https://www.holland-bakery.nl",
      customerValue: "100-250",
      customersPerYear: "1000-5000",
      email: "test@example.com",
      grossMargin: "40-60%",
      avgHourlyCost: "35-50",
      churnRate: "10-20%",
      customerServiceVolume: "50-100/week",
      customerServiceChannels: ["email", "telefoon"],
      repetitiveHoursPerWeek: "20-40",
      contentPiecesPerMonth: "5-10",
      leadsPerMonth: "100-500",
    };
    sessionStorage.setItem("auditAnswers", JSON.stringify(answers));
    navigate({ to: "/results-loading" });
  }, [navigate]);
  return <div className="p-8">Seeding test data en doorsturen...</div>;
}
