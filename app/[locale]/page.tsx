import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { ProgressNav } from "@/components/layout/ProgressNav";
import { ScrollSpyMount } from "@/components/layout/ScrollSpyMount";
import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { Differentiation } from "@/components/sections/Differentiation";
import { Services } from "@/components/sections/Services";
import { Production } from "@/components/sections/Production";
import { Journey } from "@/components/sections/Journey";
import { ProductDiscovery } from "@/components/sections/ProductDiscovery";
import { Benefits } from "@/components/sections/Benefits";
import { Showcase } from "@/components/sections/Showcase";
import { FinancialModel } from "@/components/sections/FinancialModel";
import { MarketCases } from "@/components/sections/MarketCases";
import { Contact } from "@/components/sections/Contact";
import { FloatingCapture } from "@/components/widgets/FloatingCapture";
import { LiveCounter } from "@/components/widgets/LiveCounter";
import { ScrollBackNote } from "@/components/widgets/ScrollBackNote";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollSpyMount />
      <Header />
      <ProgressNav />
      <LiveCounter />
      <ScrollBackNote />
      <main>
        <Hero />
        <Positioning />
        <Showcase />
        <Differentiation />
        <Services />
        <Production />
        <Journey />
        <ProductDiscovery />
        <Benefits />
        <FinancialModel />
        <MarketCases />
        <Contact />
      </main>
      <FloatingCapture />
    </>
  );
}
