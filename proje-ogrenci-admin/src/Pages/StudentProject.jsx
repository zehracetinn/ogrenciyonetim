import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

export default function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentStatus, setStudentStatus] = useState(null); 
  const [token, setToken] = useState(null);
  
  
  const [searchText, setSearchText] = useState("");
  const [durationFilter, setDurationFilter] = useState("all"); 
  const [techFilter, setTechFilter] = useState("all"); 
  
  const [applicationsCount, setApplicationsCount] = useState(0); 
  const [appliedIds, setAppliedIds] = useState([]); 
  const [availableTechnologies, setAvailableTechnologies] = useState([]);


  useEffect(() => {
    const storedToken = localStorage.getItem("studentToken");
    setToken(storedToken);

    if (storedToken) {
        
        checkStudentStatus(storedToken);
        fetchProjects(storedToken); 
        checkApplicationLimit(storedToken);
        fetchAppliedProjects(storedToken); 
    } else {
        window.location.replace("/student/login");
    }
  }, []);
  
  const checkStudentStatus = async (current_token) => {
    try {
        const res = await fetch("http://localhost:5297/api/student/profile", {
            headers: { Authorization: `Bearer ${current_token}` },
        });

        if (res.ok) {
            const data = await res.json();
            setStudentStatus(data.status); 
        } else {
            console.error("Profil çekilemedi:", res.status);
            setStudentStatus(2);
        }
    } catch (e) {
        console.error("Profil durumu çekilirken hata:", e);
        setStudentStatus(2);
    }
  }
  const checkApplicationLimit = async (current_token) => {
    try {
        const res = await fetch("http://localhost:5297/api/student/active-applications-count", {
            headers: { Authorization: `Bearer ${current_token}` },
        });

        if (res.ok) {
            const data = await res.json();
            setApplicationsCount(data.count || data);
        } else {
            console.warn("Başvuru limiti çekilemedi:", res.status);
        }
    } catch (e) {
        console.warn("Başvuru limiti çekilirken hata:", e);
    }
  }

  const fetchAppliedProjects = async (current_token) => {
    try {
        const res = await fetch("http://localhost:5297/api/student/applications", {
            headers: { Authorization: `Bearer ${current_token}` },
        });

        if (res.ok) {
            const data = await res.json();
            setAppliedIds(data); 
        } else {
             console.warn("Başvurulan projeler çekilemedi:", res.status);
        }
    } catch (e) {
        console.error("Başvurulan projeler çekilirken hata:", e);
    }
  }


  const fetchProjects = async (current_token) => {
    setLoading(true);

    const res = await fetch("http://localhost:5297/api/Projects/list", {
      headers: {
        Authorization: `Bearer ${current_token}`,
      },
    });

    if (res.ok) {
        const data = await res.json();
        setProjects(data);

        const allTechs = data.flatMap(p => 
            p.technologies ? p.technologies.split(',').map(t => t.trim()) : []
        );
        const uniqueTechs = [...new Set(allTechs)].filter(t => t); 
        setAvailableTechnologies(uniqueTechs);
    }
    setLoading(false);
  };

 
  const applyToProject = async (projectId) => {
  
    if (studentStatus !== 1) {
        alert("Başvuru yapabilmek için hesabınızın yönetici tarafından onaylanmış olması gerekmektedir.");
        return;
    }
    

    if (applicationsCount >= 3) {
        alert("Aynı anda en fazla 3 projeye başvuru yapabilirsiniz. Mevcut başvurularınızı tamamlamadan yeni başvuru yapamazsınız.");
        return;
    }
    
    if (appliedIds.includes(projectId)) {
        alert("Bu projeye zaten başvurunuz bulunmaktadır.");
        return;
    }

    const res = await fetch("http://localhost:5297/api/student/apply-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ projectId }),
    });

    if (!res.ok) {
      const msg = await res.text();
      
      if (res.status === 403) {
          await checkStudentStatus(token); 
          alert("Başvuru başarısız: Yetki sorunu (403). Lütfen profil durumunuzu kontrol edin.");
      } else {
          alert("Başvuru başarısız: " + msg);
      }
      return;
    }

    alert("Başvuru başarıyla gönderildi!");
    
    
    fetchProjects(token); 
    checkApplicationLimit(token); 
    setAppliedIds(prev => [...prev, projectId]);
  };
  
  
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchText.toLowerCase()));

      const duration = project.durationWeeks ?? 0;
      const matchesDuration = durationFilter === 'all' || 
                              (durationFilter === 'short' && duration <= 8) || 
                              (durationFilter === 'long' && duration > 8);    
      
      const matchesTech = techFilter === 'all' || 
                          (project.technologies && 
                            project.technologies.split(',').map(t => t.trim().toLowerCase()).includes(techFilter.toLowerCase()));
      
      return matchesSearch && matchesDuration && matchesTech;
    });
  }, [projects, searchText, durationFilter, techFilter]);


  if (loading || studentStatus === null || !token) {
    return (
      <p className="text-gray-400 text-center mt-20">Projeler yükleniyor...</p>
    );
  }
  
  const isApproved = studentStatus === 1;
  const applicationLimitReached = applicationsCount >= 3;

  
  const getButtonText = (applied, approved, limitReached) => {
      if (applied) return "Onay Bekleniyor"; 
      if (!approved) return "Onay Beklenmiyor"; 
      if (limitReached) return "Limit Dolu"; 
      return "Başvur"; 
  };
  
  const uniqueTechnologies = ['all', ...availableTechnologies];


  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Tüm Projeler</h1>

      {!isApproved && (
        <div className="p-4 bg-red-800/30 text-red-300 border border-red-700 rounded-lg mb-6">
            Projelere başvurabilmek için hesabınızın yönetici tarafından **onaylanmış** olması gerekmektedir. Lütfen profil durumunuzu kontrol edin.
        </div>
      )}
      
    
      {isApproved && (
        <div className={`p-3 text-sm rounded-lg mb-6 ${applicationLimitReached ? 'bg-yellow-800/30 text-yellow-300 border border-yellow-700' : 'bg-green-800/30 text-green-300 border border-green-700'}`}>
            Mevcut Başvuru Sayınız: **{applicationsCount} / 3**.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Proje adı veya açıklamasında ara..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-3 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:w-1/2"
        />
        <select
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          className="p-3 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:w-1/4"
        >
          <option value="all">Süreye Göre (Hepsi)</option>
          <option value="short">Kısa (≤ 8 hafta)</option>
          <option value="long">Uzun ({'>'} 8 hafta)</option>
        </select>
        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="p-3 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:w-1/4"
        >
          <option value="all">Teknolojiye Göre (Hepsi)</option>
          {availableTechnologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>

  
      {filteredProjects.length === 0 && (
        <div className="p-4 bg-neutral-900 text-neutral-400 rounded-lg">
          Filtre kriterlerinize uyan proje bulunamadı.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => {
            const isProjectApplied = appliedIds.includes(p.id); 
            const isDisabled = isProjectApplied || !isApproved || applicationLimitReached;

            return (
            <Card
                key={p.id}
                className="bg-[#181818] border border-neutral-800 p-6 rounded-xl"
            >
                <h2 className="text-xl font-bold mb-2">{p.name}</h2>

                <p className="text-neutral-400 text-sm mb-2">{p.description}</p>

                <p className="text-purple-400 text-sm mb-2">
                **{p.durationWeeks}** Hafta
                </p>

                <p className="text-neutral-300 text-sm">
                Teknolojiler: <span className="text-white">{p.technologies || "Belirtilmemiş"}</span>
                </p>

                <div className="mt-5 flex justify-between items-center">
                <span className="text-neutral-400 text-sm">
                    Başvuru Sayısı: {p.applicationsCount ?? 0}
                </span>

                <Button
                    onClick={() => applyToProject(p.id)}
                    disabled={isDisabled} 
                    
                    className={`${
                    isDisabled 
                        ? "bg-zinc-700/50 hover:bg-zinc-700/50 cursor-not-allowed text-gray-400" 
                        : "bg-blue-600 hover:bg-blue-700" 
                    }`}
                >
                    {getButtonText(isProjectApplied, isApproved, applicationLimitReached)}
                </Button>
                </div>
            </Card>
            )
        })}
      </div>
    </div>
  );
}