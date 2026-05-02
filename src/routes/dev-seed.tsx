import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dev-seed")({
  component: DevSeed,
});

const SAMPLE = {
  companyName: "Bakkerij De Korenbloem",
  industry: "Retail & E-commerce",
  size: "5-10",
  revenue: "€ 500k - € 1M",
  techStack: ["Shopify", "Klaviyo"],
  painPoints: ["Trage klantenservice", "Veel repetitief werk"],
  goals: ["Meer omzet", "Tijd besparen"],
  budget: "€ 500 – € 2.000",
  outcome: "Meer omzet",
  timeline: "3 maanden",
  website: "https://www.bakkerij-fuite.nl",
  customerValue: "35",
  customersPerYear: "12000",
  grossMargin: "40%",
  avgHourlyCost: "€ 35",
  churnRate: "10%",
  customerServiceVolume: "80",
  repetitiveHoursPerWeek: "25",
  leadsPerMonth: "400",
  conversionRate: "2%",
};

function DevSeed() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Seeding…");
  useEffect(() => {
    sessionStorage.setItem("audit_answers", JSON.stringify(SAMPLE));
    sessionStorage.removeItem("audit_report");
    sessionStorage.removeItem("audit_report_expires_at");
    setMsg("Redirecting…");
    navigate({ to: "/results-loading" });
  }, [navigate]);
  return <div className="p-12 text-center">{msg}</div>;
}
