import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

export default function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    studentNumber: "",
    email: "",
    password: "",
    knownTechnologies: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await fetch(
      "http://localhost:5297/api/Auth/student-register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (res.ok) {
      alert("Kayıt başarılı! Admin onayı sonrası giriş yapılabilir.");
      navigate("/student/login");
    } else {
      alert("Kayıt başarısız.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <div className="bg-[#181818] p-10 rounded-xl w-[450px] shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Öğrenci Kaydı</h1>

        <div className="space-y-4">
          <Input name="fullName" placeholder="Ad Soyad" onChange={handleChange} />
          <Input name="studentNumber" placeholder="Öğrenci No" onChange={handleChange} />
          <Input name="email" placeholder="E-posta" onChange={handleChange} />
          <Input name="password" type="password" placeholder="Şifre" onChange={handleChange} />
          <Input
            name="knownTechnologies"
            placeholder="Bildiğin teknolojiler (React, Python...)"
            onChange={handleChange}
          />

          <Button onClick={handleSubmit} className="w-full">
            Kaydol
          </Button>
        </div>
      </div>
    </div>
  );
}
