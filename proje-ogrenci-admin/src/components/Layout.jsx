import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Layout() {
  const navigate = useNavigate();


  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  return (
    <div className="flex bg-[#0f0f0f] text-white min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] p-6 border-r border-zinc-800">
        <h2 className="text-xl font-bold mb-6 text-red-400">
          Proje Yönetimi
        </h2>

        <nav className="flex flex-col gap-3">
          <a href="/students" className="hover:text-red-300">
            Öğrenci Yönetimi
          </a>
          <a href="/projects" className="hover:text-red-300">
            Projeler
          </a>

          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              window.location.href = "/admin-login";
            }}
            className="text-left text-red-500 hover:text-red-300 mt-4"
          >
            Çıkış Yap
          </button>
        </nav>
      </aside>

      {/* İçerik */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
