import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { MailIcon, LockIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfileUser, login } from "@/service/auth.service";
import { toast } from "sonner";
import Link from "next/link";

export default function FormLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Harap Isi Field yang Kosong");
      return;
    }
    setIsLoading(true);
    const response = await login({ email, password });
    if (!response.status || response.status === null) {
      setIsLoading(false);
      toast.error(response.pesan || "Gagal untuk login");
      return;
    }
    toast.success("Berhasil Login");
    const user = await getProfileUser();
    const role = user.data?.profile.role;
    if (callbackUrl) {
      router.push(callbackUrl);
      return;
    }
    switch (role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "petugas":
        router.push("/petugas/dashboard");
        break;
      default:
        router.push("/");
        break;
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-cyan-sky p-4 font-instrument-sans">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 shadow-2xl rounded-lg bg-white"
      >
        <div className="mb-4 text-center flex flex-col justify-center items-center gap-2">
          <div className="rounded-full p-2 bg-cyan-sky w-fit h-fit text-white text-3xl">
            <FontAwesomeIcon icon={faCarRear} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Masuk</h1>
          <p className="text-slate-600 text-sm">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email
          </label>
          <InputGroup>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="nama@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputGroupAddon>
              <MailIcon className="text-slate-400" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Kata Sandi
          </label>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <InputGroupAddon>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-sky text-white font-medium py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {isLoading ? "Sedang masuk..." : "Masuk"}
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">atau</span>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
