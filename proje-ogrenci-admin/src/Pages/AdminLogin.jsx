import React, { useState, useEffect } from 'react';

export default function AdminLogin() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ================================================================
  // TOKEN DOĞRULAMA (Sayfa açıldığında çalışır)
  // ================================================================
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) return;

    fetch("http://localhost:5297/api/Projects", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("admin_token");
        } else if (res.ok) {
          window.location.href = "/projects";
        }
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
      });
  }, []);


  // ================================================================
  // LOGIN SUBMIT
  // ================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5297/api/Auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password })
      });

      if (!response.ok) {
        // Hata kodu 401 veya 403 ise 'err' değeri boş gelebilir, bu yüzden bir fallback mesajı kullanılır.
        const err = await response.text();
        setError(err || "Kullanıcı adı veya şifre hatalı.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // === TOKEN KAYDET ===
      localStorage.setItem("admin_token", data.token);

      console.log("Admin login başarılı. Token:", data.token);

      window.location.href = "/projects";

    } catch (err) {
      console.error(err);
      setError("Sunucuya ulaşılamıyor.");
    }

    setIsLoading(false);
  };


  // ================================================================
  // YENİ STİLDE UI (2. Resimdeki stile uyarlandı)
  // ================================================================
  return (
    // Ana kapsayıcı: Tamamen koyu arkaplan (bg-black)
    <div className="min-h-screen w-full flex items-center justify-center bg-black font-sans text-white">

      {/* Login Kutusu: Koyu gri arkaplan, daha yumuşak köşeler ve minimal gölge */}
      <div className="w-full max-w-sm bg-gray-800 rounded-xl p-8 shadow-xl relative z-10">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Yönetici Portalı
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            {/* Etiket: Etiket kaldırıldı, sadece placeholder ve input odaklanma rengi kaldı */}
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              // Input Stili: Koyu zemin, ince kenarlık, mavi odaklanma halkası (focus ring)
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 transition duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Kullanıcı Adı" // placeholder metni değiştirildi
            />
          </div>

          <div>
            {/* Etiket: Etiket kaldırıldı */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Input Stili: Koyu zemin, ince kenarlık, mavi odaklanma halkası (focus ring)
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 transition duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Şifre" // placeholder metni değiştirildi
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium mt-4">{error}</p>}

          {/* Buton Stili: Koyu mavi zemin (2. resimdeki butona benzer) */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold text-white tracking-wide transition duration-200 disabled:opacity-50 mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        
        {/* İhtiyaç halinde eklenebilecek minimal bağlantı/yönlendirme */}
        <div className="text-center mt-6 text-sm">
            <a href="/" className="text-gray-500 hover:text-white transition duration-200">
                Öğrenci Girişine Geri Dön
            </a>
        </div>
      </div>
    </div>
  );
}