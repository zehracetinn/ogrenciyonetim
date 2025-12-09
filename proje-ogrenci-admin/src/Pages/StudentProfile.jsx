import { useEffect, useState } from "react";
import { Card } from "@/components/card";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token'ı state veya ref yerine burada okumak sorun yaratabilir. 
  // Token'ın değişmesi durumunda useEffect'in tekrar çalışması için düzenliyoruz.
  const [token, setToken] = useState(localStorage.getItem("studentToken")); 

  useEffect(() => {
    // Token yoksa girişe yönlendir
    if (!token) {
        window.location.replace("/student/login");
        return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5297/api/student/profile", {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // HATA DÜZELTME 1: 401/403 hatası kontrolü (API erişimini reddediyor)
    if (res.status === 401 || res.status === 403) {
        console.error("Profil çekilemedi (401/403). Token süresi dolmuş veya yetki yok.");
        localStorage.removeItem("studentToken");
        alert("Yetkilendirme hatası: Lütfen yeniden giriş yapın.");
        window.location.replace("/student/login");
        setLoading(false);
        return;
    }

    // HATA DÜZELTME 2: JSON okuma kontrolü
    // API, 200 OK dışındaki durumlarda bazen boş yanıt döner.
    let data = null;
    try {
        data = await res.json();
    } catch (e) {
        console.error("API'den geçerli JSON alınamadı (Muhtemelen 204 No Content veya sunucu hatası).", e);
        setLoading(false);
        setProfile(null);
        return;
    }

    setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <p className="text-neutral-400 text-center mt-20">
        Profil bilgilerin yükleniyor...
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="text-red-400 text-center mt-20">
        Profil bilgisi alınamadı. Lütfen tekrar giriş yap.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profilim</h1>

      <Card className="bg-[#181818] border border-neutral-700 p-8 rounded-xl">
        
        {/* Ad Soyad */}
        <div className="mb-4">
          <p className="text-neutral-400 text-sm">Ad Soyad</p>
          <p className="text-xl font-semibold text-white">{profile.fullName}</p>
        </div>

        {/* Okul Numarası */}
        <div className="mb-4">
          <p className="text-neutral-400 text-sm">Öğrenci Numarası</p>
          <p className="text-lg text-neutral-200">{profile.studentNumber}</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <p className="text-neutral-400 text-sm">E-posta</p>
          <p className="text-neutral-200">{profile.email}</p>
        </div>

        {/* Bilinen Teknolojiler */}
        <div className="mb-4">
          <p className="text-neutral-400 text-sm">Bildiği Teknolojiler</p>
          <p className="text-neutral-200">
            {profile.knownTechnologies || "Belirtilmemiş"}
          </p>
        </div>

        {/* Hesap Durumu */}
        <div className="mb-6">
          <p className="text-neutral-400 text-sm">Hesap Durumu</p>

          {profile.status === 0 && (
            <span className="px-3 py-1 bg-yellow-700 text-yellow-200 rounded-lg text-sm">
              ⏳ Beklemede – Admin onayı gerekli
            </span>
          )}

          {profile.status === 1 && (
            <span className="px-3 py-1 bg-green-700 text-green-200 rounded-lg text-sm">
              ✔ Onaylı
            </span>
          )}

          {profile.status === 2 && (
            <span className="px-3 py-1 bg-red-700 text-red-200 rounded-lg text-sm">
              ❌ Reddedilmiş
            </span>
          )}
        </div>

        {/* Başvurduğu Proje Sayısı */}
        <div className="mb-2">
          <p className="text-neutral-400 text-sm">Toplam Başvuru</p>
          <p className="text-neutral-200 font-semibold">
            {profile.applicationsCount ?? 0} proje
          </p>
        </div>
      </Card>
    </div>
  );
}