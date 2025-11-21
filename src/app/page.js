"use client";
import Navbar from "@/components/layout/navbar/navbar";
import TeksWelcome from "@/components/views/welcome/teks";
import CarRecommendations from "@/components/views/recomendation/car-recommendations";
import OurService from "@/components/views/our-services";
import Footer from "@/components/views/footer/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <TeksWelcome />
      <CarRecommendations />
      <OurService />
      <Footer />
    </main>
  );
}
