import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function StudentLayout() {
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) navigate("/student/login");
   
  }, [navigate]);


  if (!localStorage.getItem("studentToken")) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-neutral-400">
              Yetkilendiriliyor...
          </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151515] p-6 border-r border-neutral-800">
        <h2 className="text-xl font-bold mb-8">Öğrenci Paneli</h2>

        <nav className="space-y-4">
          <Link
            to="/student/projects"
            className="block text-neutral-300 hover:text-white"
          >
            Projeler
          </Link>

          <Link
            to="/student/my-projects"
            className="block text-neutral-300 hover:text-white"
          >
            Başvurularım
          </Link>

          <Link
            to="/student/profile"
            className="block text-neutral-300 hover:text-white"
          >
            Profilim
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("studentToken");
              navigate("/student/login");
            }}
            className="block text-red-400 hover:text-red-300 mt-6"
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