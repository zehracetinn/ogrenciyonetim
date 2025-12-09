import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Dialog } from "@/components/dialog";

export default function ProjectApplicants() {
  const { projectId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getToken = () => localStorage.getItem("admin_token");

  // ========================================
  // BAŞVURANLARI YÜKLEME
  // ========================================
  async function loadApplicants() {
    const token = getToken();

    if (!token) {
      console.error("Admin token bulunamadı!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5297/api/Projects/applications/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        console.error("API Hatası:", res.status);
        setApplicants([]);
        setLoading(false);
        return;
      }

      const json = await res.json();
      setApplicants(json || []);
    } catch (err) {
      console.error("Fetch Hatası:", err);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplicants();
  }, [projectId]);

  // ========================================
  // ONAY – RED
  // ========================================
  async function approve(applicationId) {
    const token = getToken();

    await fetch(
      `http://localhost:5297/api/Projects/applications/${applicationId}/approve`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    loadApplicants();
  }

  async function reject(applicationId) {
    const token = getToken();

    await fetch(
      `http://localhost:5297/api/Projects/applications/${applicationId}/reject`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    loadApplicants();
  }

  // ========================================
  // LOADING
  // ========================================
  if (loading) {
    return (
      <div className="text-zinc-300 animate-pulse">
        Başvuru verileri yükleniyor...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Proje Başvuruları</h1>

      {applicants.length === 0 && (
        <div className="bg-zinc-900 p-10 text-center text-zinc-500 rounded-lg">
          Bu projeye henüz başvuru yok.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {applicants.map((a) => {
          const student = a.student || {}; // null güvenliği

          return (
            <Card key={a.id}>
              <h2 className="text-xl font-semibold text-white">
                {student.fullName || "İsim bulunamadı"}
              </h2>

              <p className="text-zinc-400">{student.email || "Email yok"}</p>

              {/* DURUM */}
              <div className="mt-3">
                {a.status === "Pending" && (
                  <Badge className="bg-yellow-600 text-black">Beklemede</Badge>
                )}
                {a.status === "Approved" && (
                  <Badge className="bg-green-600">Onaylandı</Badge>
                )}
                {a.status === "Rejected" && (
                  <Badge className="bg-red-600">Reddedildi</Badge>
                )}
              </div>

              {a.status === "Pending" && (
                <div className="flex gap-3 mt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => approve(a.id)}
                  >
                    Onayla
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => reject(a.id)}
                  >
                    Reddet
                  </Button>
                </div>
              )}

              <p className="text-zinc-500 text-sm mt-2">
                Başvuru Tarihi:{" "}
                {new Date(a.applyDate).toLocaleDateString("tr-TR")}
              </p>

              <div className="flex gap-3 mt-5">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowModal(true);
                  }}
                  disabled={!a.student}
                >
                  Öğrenci Profili
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* PROFİL MODAL */}
      {showModal && selectedStudent && (
        <Dialog>
          <Card>
            <h2 className="text-2xl font-bold mb-4">Öğrenci Profili</h2>

            <div className="flex flex-col gap-4 text-zinc-300">
              <p>
                <strong>Ad Soyad:</strong> {selectedStudent.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedStudent.email}
              </p>
              <p>
                <strong>Okul No:</strong> {selectedStudent.studentNumber}
              </p>
              <p>
                <strong>Teknolojiler:</strong>{" "}
                {selectedStudent.knownTechnologies}
              </p>

              <Button
                className="bg-green-600 hover:bg-green-700 mt-4"
                onClick={() => setShowModal(false)}
              >
                Kapat
              </Button>
            </div>
          </Card>
        </Dialog>
      )}
    </>
  );
}
