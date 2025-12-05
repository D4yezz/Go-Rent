"use client";
import FormLogin from "@/components/views/auth/loginView";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main>
        <FormLogin />
      </main>
    </Suspense>
  );
}
