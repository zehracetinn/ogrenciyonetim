import { useEffect, useState } from "react";

// =========================================================================================
// === LAYOUT (RESİM STİLİNE UYGUN SADELEŞTİRİLDİ) ===
// =========================================================================================

// Layout: Sadece İçerik Alanı (Tam Genişlik) - Arkaplan Vurgusu KALDIRILDI
const Layout = ({ children }) => (
  // Sadece ana koyu arkaplan (bg-gray-950) bırakıldı.
  <div className="flex min-h-screen bg-gray-950 relative overflow-hidden">
    {/* Eski Arkaplan Vurgusu kaldırıldı / Resimdeki stil daha düz */}
    
    {/* İçerik Alanı: Tam genişlik */}
    <div className="flex-1 p-8 text-white overflow-y-auto relative z-10">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  </div>
);

// =========================================================================================
// === UI COMPONENTS (RESİM STİLİNE UYGUN GÜNCELLENDİ) ===
// =========================================================================================

const Card = ({ children, className = "" }) => (
  // Kart Stili: Daha köşeli (rounded-md), daha sade koyu arka plan.
  <div className={`bg-gray-900 border border-gray-800 rounded-md p-6 flex flex-col justify-between shadow-lg shadow-black/10 h-full transition-all duration-300 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "", variant = "primary", disabled = false }) => {
  // Temel Buton Stili: Daha az kavisli (rounded-md) ve daha az parlak gölge.
  const base = "px-4 py-2 font-semibold transition-all duration-300 w-full text-center rounded-md shadow-md hover:shadow-lg hover:scale-[1.01] disabled:opacity-50 whitespace-nowrap";
  
  const variants = {
    // 1. Primary (Yeni Proje Oluştur - Koyu Yeşil/Turkuaz Vurgu)
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/40", 
    // 2. Danger (Sil - Koyu Kırmızı)
    danger: "bg-red-800 hover:bg-red-900 text-white shadow-red-900/40", 
    // 3. Secondary (İptal/Vazgeç - Koyu Gri)
    secondary: "bg-gray-700 hover:bg-gray-600 text-white shadow-gray-800/40",
    // 4. Warning (Düzenle - Koyu Mavi/Mor, daha sade)
    warning: "bg-indigo-800 hover:bg-indigo-700 text-white shadow-indigo-900/40",
    // 5. Info (Başvuruları Gör - Resimdeki Başvur butonuna yakın, Koyu Lacivert/Mavi)
    info: "bg-blue-800 hover:bg-blue-700 text-white shadow-blue-900/40", 
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children }) => (
  // Badge Stili (Resimdeki süre ve teknoloji vurgusuna uygun koyu yeşil/sarımsı ton)
  <span className="inline-block px-2 py-0.5 text-xs font-semibold text-yellow-400 bg-gray-800 border border-gray-700 rounded-full">
    {children}
  </span>
);

const Dialog = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    {/* Dialog Kutusu Stili: Daha sade kenarlık */}
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-10 shadow-[0_0_50px_rgba(15,15,15,0.8)] w-full max-w-lg relative">
      {children}
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    // Input Stili: Koyu arka plan, yeşil odaklanma halkası (Resimdeki vurguya uygun)
    className="w-full bg-gray-950 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 rounded-md 
      focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
  />
);

const TextArea = ({ value, onChange, placeholder }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    // TextArea Stili: Koyu arka plan, yeşil odaklanma halkası
    className="w-full bg-gray-950 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 h-32 rounded-md
      focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
  />
);

// =========================================================================================
// === ADMIN PROJECTS PAGE (GÖRSEL GÜNCELLEMELER YAPILDI) ===
// =========================================================================================

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State Management
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    durationWeeks: "",
    technologies: "",
  });

  // Helper function to get token
  const getToken = () => localStorage.getItem("admin_token");

  // Authentication check on load
  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      window.location.replace("/admin-login"); 
    }
  }, []);
  
  // Close and reset modal state
  const closeModals = () => {
    setShowModal(false);
    setProjectIdToDelete(null);
    setModalMode('create');
    setForm({ id: null, name: "", description: "", durationWeeks: "", technologies: "" });
  };

  // Modal open handlers
  const openCreateModal = () => {
    setForm({ id: null, name: "", description: "", durationWeeks: "", technologies: "" });
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setForm({ ...project, durationWeeks: String(project.durationWeeks) }); 
    setModalMode('edit');
    setShowModal(true);
  };
  
  const openDeleteModal = (id) => {
    setProjectIdToDelete(id);
    setModalMode('delete');
    setShowModal(true);
  }

  // === Projeleri Yükle ===
  async function loadProjects() {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5297/api/Projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (res.status === 401) {
        console.error("401 - Token geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın.");
        window.location.replace("/admin-login");
        return;
      }

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("API Bağlantı Hatası:", err);
    } finally {
      setLoading(false);
    }
  }

  // === Proje Kaydet/Güncelle ===
  async function saveProject() {
    const token = getToken();
    const isEdit = form.id !== null;

    if (!form.name || !form.description || !form.durationWeeks || !form.technologies) {
        console.error("Lütfen tüm alanları doldurun.");
        return;
    }

    const url = isEdit
      ? `http://localhost:5297/api/Projects/${form.id}`
      : "http://localhost:5297/api/Projects";

    const method = isEdit ? "PUT" : "POST";

    const body = {
      id: form.id ?? 0,
      name: form.name,
      description: form.description,
      durationWeeks: Number(form.durationWeeks),
      technologies: form.technologies,
    };

    try {
        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
    
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Kaydetme hatası:", errorText);
          return;
        }
    
        closeModals();
        loadProjects();

    } catch (err) {
        console.error("Ağ hatası:", err);
    }
  }

  // === Proje Silme Onayı ===
  async function deleteProjectConfirmed() {
    if (!projectIdToDelete) return;

    const token = getToken();

    try {
        const res = await fetch(`http://localhost:5297/api/Projects/${projectIdToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!res.ok) {
          console.error("Silme hatası:", res.status);
          return;
        }
    
        closeModals();
        loadProjects();

    } catch (err) {
        console.error("Ağ hatası:", err);
    }
  }

  // İlk yükleme
  useEffect(() => {
    if (getToken()) {
        loadProjects();
    } else {
        setLoading(false);
    }
  }, []);

  // === Loading ekranı ===
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-emerald-400 text-lg font-medium animate-pulse">Proje listesi yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  // === Render ===
  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
        <div>
          {/* Başlık: Resimdeki koyu temaya uygun düz renk */}
          <h1 className="text-4xl font-extrabold text-white">
            Proje Yönetimi
          </h1>
          <p className="text-gray-400 mt-2">Tüm projeleri buradan yönetebilir, düzenleyebilir ve silebilirsiniz.</p>
        </div>

        {/* Buton: Primary (Koyu Yeşil/Turkuaz) */}
        <Button className="w-full sm:w-auto px-6 whitespace-nowrap" variant="primary" onClick={openCreateModal}>
          + Yeni Proje Oluştur
        </Button>
      </div>

      {/* Proje Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"> 
        {projects.length === 0 ? (
          // Boş Durum Stili
          <div className="col-span-full text-center text-gray-500 py-20 bg-gray-900 border border-gray-800 rounded-md shadow-lg">
            <p className="text-xl">🤷‍♂️ Hiç proje bulunamadı. Hemen bir tane oluşturun!</p>
          </div>
        ) : (
          projects.map((p) => (
            <Card key={p.id}> 
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white">{p.name}</h2>
                  {/* Süre bilgisi: Resimdeki gibi koyu yeşil/sarımsı vurgu */}
                  <Badge>{p.durationWeeks} Hafta</Badge> 
                </div>

                <p className="text-gray-400 mb-6 line-clamp-3">{p.description}</p>

                <div className="mb-6">
                  <p className="text-sm text-emerald-400 font-bold mb-3 uppercase tracking-wider">Teknolojiler</p>
                  <div className="flex flex-wrap gap-2">
                    {p.technologies.split(",").map((t, i) => (
                      <Badge key={i}>{t.trim()}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buton Alanı */}
              <div className="flex flex-col gap-3 mt-auto pt-5 border-t border-gray-700/60"> 
                {/* Info Butonu: Koyu Lacivert/Mavi (Resimdeki 'Başvur' butonunun Admin versiyonu) */}
                <Button
                  variant="info" 
                  onClick={() => (window.location.href = `/projects/${p.id}/applicants`)}
                >
                  Başvuruları Gör
                </Button>

                <div className="flex gap-3">
                  {/* Warning Butonu: Koyu Mavi/Mor (Düzenle) */}
                  <Button variant="warning" className="flex-1" onClick={() => openEditModal(p)}>
                    Düzenle
                  </Button>

                  {/* Danger Butonu: Koyu Kırmızı */}
                  <Button variant="danger" className="flex-1" onClick={() => openDeleteModal(p.id)}>
                    Sil
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal - Create, Edit, and Delete Confirmation */}
      {showModal && (
        <Dialog onClose={closeModals}>
          
          {(modalMode === 'create' || modalMode === 'edit') && (
            <>
              {/* Modal Başlığı (Düz renk) */}
              <h2 className="text-3xl font-bold mb-8 text-white">
                {form.id ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}
              </h2>

              <div className="flex flex-col gap-5">
                <Input
                  placeholder="Proje Adı"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <TextArea
                  placeholder="Açıklama"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <Input
                  placeholder="Süre (Hafta)"
                  type="number"
                  value={form.durationWeeks}
                  onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })}
                />

                <Input
                  placeholder="Teknolojiler (Virgülle ayırın)"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                />

                <div className="flex gap-4 mt-6">
                  {/* Primary Buton: Koyu Yeşil/Turkuaz */}
                  <Button variant="primary" onClick={saveProject} disabled={loading}>
                    {form.id ? "Güncelle" : "Oluştur"}
                  </Button>

                  {/* Secondary Buton: Gri */}
                  <Button variant="secondary" onClick={closeModals}>
                    İptal
                  </Button>
                </div>
              </div>
            </>
          )}

          {modalMode === 'delete' && (
            <>
              {/* Modal Başlığı */}
              <h2 className="text-3xl font-bold mb-4 text-red-500">Proje Silme Onayı</h2>
              <p className="text-gray-400 mb-8 text-lg">
                <span className="font-semibold text-white">Bu projeyi silmek istediğinizden emin misiniz?</span> Bu işlem geri alınamaz.
              </p>
              
              <div className="flex gap-4">
                {/* Danger Butonu: Koyu Kırmızı */}
                <Button variant="danger" onClick={deleteProjectConfirmed} disabled={loading}>
                  Evet, Sil
                </Button>
                {/* Secondary Buton: Gri */}
                <Button variant="secondary" onClick={closeModals}>
                  Vazgeç
                </Button>
              </div>
            </>
          )}
        </Dialog>
      )}
    </Layout>
  );
}