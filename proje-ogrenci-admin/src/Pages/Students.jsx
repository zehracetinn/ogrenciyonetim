import { useEffect, useState } from "react";
import { Check, X, Search, Filter, Hash, Mail } from "lucide-react";

// Enum durumlarını dize yerine sayısal değerlerle eşleştiren haritalama
const STATUS_MAP = {
  All: null,
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  // Başlangıç filtresini "Bekleyenler" olarak ayarlamak daha mantıklıdır.
  const [activeFilter, setActiveFilter] = useState("Pending"); 
  const [search, setSearch] = useState("");

  async function loadStudents() {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("http://localhost:5297/api/Admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
          console.error("Yetkilendirme hatası (401). Admin token'ı geçersiz.");
          window.location.replace("/admin-login"); 
          return;
      }
      
      const data = await response.json();
      setStudents(data);
      setLoading(false);
      // Filtrelemeyi burada çağırıyoruz, böylece data yüklendikten sonra listelenir.
      applyFilters(activeFilter, search, data); 
    } catch (e) {
      // Önceki hatanın çözülmesini sağlayan güvenlik kontrolünü tutuyoruz
      console.error("Öğrenci verileri yüklenirken hata oluştu:", e);
      setLoading(false);
    }
  }

  // Veri setini doğrudan argüman olarak alacak şekilde güncellendi.
  function applyFilters(filter = activeFilter, query = search, data = students) {
    let list = [...data];
    const statusValue = STATUS_MAP[filter]; // "Pending" -> 0, "Approved" -> 1, "Rejected" -> 2

    // Filtreleme mantığı: Sayısal değer üzerinden karşılaştırma yapılır.
    if (filter !== "All") {
      // s.status'ün sayı (number) olduğunu varsayarak karşılaştırma yapıyoruz
      list = list.filter((s) => s.status === statusValue);
    }

    // Arama mantığı
    if (query.trim() !== "") {
      const t = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(t) ||
          s.email?.toLowerCase().includes(t) ||
          s.schoolNumber?.toString().toLowerCase().includes(t) 
      );
    }
    setFiltered(list);
  }

  // ONAYLAMA FONKSİYONU
  async function approve(id) {
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`http://localhost:5297/api/Admin/students/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
        loadStudents(); 
    } else {
        console.error("Onaylama başarısız oldu. Durum:", res.status);
    }
  }

  // REDDETME FONKSİYONU
  async function reject(id) {
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`http://localhost:5297/api/Admin/students/${id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
        loadStudents();
    } else {
        console.error("Reddetme başarısız oldu. Durum:", res.status);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    applyFilters(activeFilter, search);
  }, [activeFilter, search, students]);

  // Yardımcı fonksiyon: Durum numarasından dize/stil üretir
  const getStatusInfo = (status) => {
    switch (status) {
      case 0: // Pending
        return { label: "Onay Bekliyor", color: "yellow" };
      case 1: // Approved
        return { label: "Onaylandı", color: "green" };
      case 2: // Rejected
        return { label: "Reddedildi", color: "red" };
      default:
        return { label: "Bilinmiyor", color: "zinc" };
    }
  };

  // -----------------------
  // LOADING EKRANI
  // -----------------------
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-red-300 min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-red-500 rounded-full mb-4 animate-bounce"></div>
          Veriler Yükleniyor...
        </div>
      </div>
    );
  }

  // -----------------------
  // SAYFA İÇERİĞİ
  // -----------------------
  return (
    <div className="relative min-h-screen text-white font-sans pb-20 p-6 sm:p-10">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Öğrenci Yönetimi
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Kayıt başvurularını incele ve onayla.
        </p>
      </div>

      {/* Arama */}
      <div className="mb-6">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
            <Search size={18} />
          </div>

          <input
            type="text"
            placeholder="İsim, email veya no ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full bg-zinc-900 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-zinc-800 text-white placeholder-neutral-500"
          />
        </div>
      </div>

      {/* Filtre Butonları */}
      <div className="flex flex-wrap gap-2 mb-8 p-2 rounded-xl w-fit">
        {[
          { id: "All", label: "Tümü" },
          { id: "Pending", label: "Bekleyenler" },
          { id: "Approved", label: "Onaylananlar" },
          { id: "Rejected", label: "Reddedilenler" },
        ].map((tab) => {
             const isActive = activeFilter === tab.id;

             let className = "text-neutral-400 hover:text-white hover:bg-zinc-800";
             if (isActive) {
                // Aktif filtre için durum bazlı renk vurgusu
                if (tab.id === "Pending") className = "bg-yellow-600/20 text-yellow-200 border border-yellow-500/30 font-semibold";
                else if (tab.id === "Approved") className = "bg-green-600/20 text-green-200 border border-green-500/30 font-semibold";
                else if (tab.id === "Rejected") className = "bg-red-600/20 text-red-200 border border-red-500/30 font-semibold";
                else className = "bg-zinc-700/50 text-white border border-zinc-500/30 font-semibold"; // All için
             }


            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm transition ${className}`}
              >
                {tab.label}
              </button>
            )
        })}
      </div>

      {/* LİSTE */}
      <div className="px-0">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-700">
            <Filter className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
            <p className="text-neutral-400 text-lg">Bu filtreye uygun öğrenci yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((s) => {
                const statusInfo = getStatusInfo(s.status); // Sayısal değeri dize ve renge çevirir
                const isPending = s.status === 0; // 0 = Pending
                const statusColor = statusInfo.color;
                
                return (
                  <div
                    key={s.id}
                    // Kart stili, koyu tema ve kenarlık ile güncellendi
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-2xl p-6 transition-all flex flex-col shadow-xl"
                  >
                    {/* ÜST */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-${statusColor}-600/10 border border-${statusColor}-600/50 flex items-center justify-center text-${statusColor}-400 font-bold text-lg`}>
                        {s.fullName?.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-white">{s.fullName}</h2>

                        <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
                          <Mail size={12} /> {s.email}
                        </div>

                        <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                          <Hash size={12} /> {s.schoolNumber}
                        </div>
                      </div>
                    </div>

                    {/* DURUM */}
                    <div className="mb-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs border ${
                          s.status === 0
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : s.status === 1
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* BUTONLAR - Sadece Pending durumunda aktif */}
                    <div className="grid grid-cols-2 gap-3 border-t border-zinc-700 pt-4 mt-auto">
                      <button
                        onClick={() => reject(s.id)}
                        disabled={!isPending}
                        className={`flex items-center justify-center gap-2 py-2 border rounded-lg transition ${
                           isPending 
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-md"
                            : "bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed"
                        }`}
                      >
                        <X size={16} /> Reddet
                      </button>

                      <button
                        onClick={() => approve(s.id)}
                        disabled={!isPending}
                        className={`flex items-center justify-center gap-2 py-2 border rounded-lg shadow-md transition ${
                          isPending 
                            ? "bg-green-600 hover:bg-green-700 text-white border-green-700"
                            : "bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed"
                        }`}
                      >
                        <Check size={16} /> Onayla
                      </button>
                    </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
}