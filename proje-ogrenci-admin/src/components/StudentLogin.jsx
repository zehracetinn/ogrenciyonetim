import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    const res = await fetch("http://localhost:5297/api/Auth/student-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Giriş başarısız. Bilgileri kontrol edin.");
      return;
    }

    const data = await res.json();
    localStorage.setItem("studentToken", data.token);

    navigate("/student/projects");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <div className="bg-[#181818] p-10 rounded-xl w-[400px] shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Öğrenci Girişi</h1>

        <div className="space-y-4">
          <Input
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button onClick={handleSubmit} className="w-full">
            Giriş Yap
          </Button>

          <p className="text-neutral-400 text-sm text-center">
            Hesabın yok mu?{" "}
            <span
              className="text-blue-400 cursor-pointer"
              onClick={() => navigate("/student/register")}
            >
              Kayıt Ol
            </span>
          </p>


          <p
          className="text-neutral-500 text-sm text-center mt-2 cursor-pointer hover:text-neutral-300"
          onClick={() => navigate("/admin-login")}
          >
            Yönetici Girişi
          </p>






        </div>
      </div>
    </div>
  );
}
