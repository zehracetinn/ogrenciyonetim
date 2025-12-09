import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ADMIN
import Layout from "@/components/Layout";
import AdminLogin from "@/Pages/AdminLogin";
import Students from "@/Pages/Students";
import Projects from "@/Pages/Projects";
import ProjectApplicants from "@/Pages/ProjectApplicants";

// STUDENT
import StudentLayout from "@/components/StudentLayout";
import StudentLogin from "@/components/StudentLogin";
import StudentRegister from "@/components/StudentRegister";
import StudentProject from "@/Pages/StudentProject";
import StudentMyProjects from "@/Pages/StudentMyProjects";
import StudentProfile from "@/Pages/StudentProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* *** KÖK YÖNLENDİRME *** */}
        {/* "/" adresine gidildiğinde öğrenci girişine yönlendirir. */}
        <Route path="/" element={<Navigate to="/student/login" replace />} /> 

        {/* ---------------- ADMIN YÖNLENDİRMELERİ ---------------- */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Paneli İçin Korumalı Yollar */}
        <Route element={<Layout />}>
          <Route path="/students" element={<Students />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/projects/:projectId/applicants"
            element={<ProjectApplicants />}
          />
        </Route>

        {/* ---------------- ÖĞRENCİ YÖNLENDİRMELERİ ---------------- */}
        
        {/* Giriş ve Kayıt (Layout dışı yollar) */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />

        {/* Öğrenci Paneli İçin Korumalı Yollar */}
        <Route element={<StudentLayout />}>
          <Route path="/student/projects" element={<StudentProject />} />
          <Route path="/student/my-projects" element={<StudentMyProjects />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;