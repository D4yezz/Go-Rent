"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register, registerUser } from "@/service/auth.service";
import { toast } from "sonner";
import supabase from "@/lib/supabase/client";
import Link from "next/link";

export function SignupForm({ className, ...props }) {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [credential, setCredential] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    no_hp: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setCredential({
      ...credential,
      [e.target.name]: e.target.value,
    });
  };
  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await registerUser({
      username: credential.username,
      email: credential.email,
      password: credential.password,
      confirm_password: credential.confirm_password,
      no_hp: credential.no_hp,
    });

    if (!response.status) {
      toast.error(response.pesan);
      return;
    }

    console.log(response);
    toast.success("Berhasil register! Silakan login.");
    router.push("/auth/login");
  };

  return (
    <div
      className={cn("flex flex-col gap-6 font-instrument-sans", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleRegister}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Masukkan email anda untuk membuat akun
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  value={credential.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={credential.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                />
                <FieldDescription>
                  Kami akan menghubungi email anda. Jangan pernah membagikan
                  email ini kepada siapapun
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="no_hp">Nomor HP</FieldLabel>
                <Input
                  id="no_hp"
                  name="no_hp"
                  value={credential.no_hp}
                  onChange={handleChange}
                  placeholder="081234567890"
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={credential.password}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      name="confirm_password"
                      type="password"
                      placeholder="••••••••"
                      value={credential.confirm_password}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>Minimal 8 karakter</FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  Buat Akun
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Sudah punya akun? <Link href="/auth/login">Masuk</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={800}
              height={800}
              src="/car/nissan-gtr/1.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
