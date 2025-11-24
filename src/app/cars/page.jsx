import Navbar from "@/components/layout/navbar/navbar";
import AllCars from "@/components/views/cars";
import Footer from "@/components/views/footer/footer";
import React from "react";

export default function CarsPage() {
  return (
    <main>
      <Navbar />
      <AllCars />
      <Footer />
    </main>
  );
}
