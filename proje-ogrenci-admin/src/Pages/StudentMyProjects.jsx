import { useEffect, useState } from "react";
import { Card } from "@/components/card";

export default function StudentMyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const token = localStorage.getItem("studentToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/student/login";
      return;
    }

    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const res = await fetch("http://localhost:5297/api/student/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("API Error:", res.status);
        setProjects([]);
        return;
      }

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-gray-400 text-center mt-20">
        Başvurduğun projeler yükleniyor...
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Başvurularım</h1>

      {projects.length === 0 && (
        <div className="p-4 bg-neutral-900 text-neutral-400 rounded-lg">
          Henüz bir projeye başvurmadın.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <Card
            key={p.project?.id ?? p.projectId}
            className="bg-[#181818] border border-neutral-800 p-6 rounded-xl"
          >
            {/* PROJE ADI */}
            <h2 className="text-xl font-bold mb-2">{p.project?.name}</h2>

            {/* AÇIKLAMA */}
            <p className="text-neutral-400 text-sm mb-2">
              {p.project?.description}
            </p>

            {/* SÜRE */}
            <p className="text-purple-400 text-sm mb-2">
              {p.project?.durationWeeks} Hafta
            </p>

            {/* TEKNOLOJİLER */}
            <p className="text-neutral-300 text-sm mb-4">
              Teknolojiler:{" "}
              <span className="text-white">
                {p.project?.technologies || "Belirtilmemiş"}
              </span>
            </p>

            {/* BAŞVURU DURUMU */}
            <div className="mt-4">
              {p.status === "Pending" && (
                <span className="px-3 py-1 bg-yellow-700 text-yellow-200 rounded-lg text-sm">
                  ⏳ Beklemede
                </span>
              )}

              {p.status === "Approved" && (
                <span className="px-3 py-1 bg-green-700 text-green-200 rounded-lg text-sm">
                  ✅ Kabul Edildi
                </span>
              )}

              {p.status === "Rejected" && (
                <span className="px-3 py-1 bg-red-700 text-red-200 rounded-lg text-sm">
                  ❌ Reddedildi
                </span>
              )}
            </div>

            {/* BAŞVURU TARİHİ */}
            <p className="text-neutral-500 text-xs mt-4">
              Başvuru Tarihi:{" "}
              {p.applyDate
                ? new Date(p.applyDate).toLocaleDateString("tr-TR")
                : "—"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
