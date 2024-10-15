import React from "react";
import {BrowserRouter, Routers, Routes, Route, Navigate} from  "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import CoordinatorTab from "./pages/coordinator/CoordinatorTab";
import UserList from "./pages/estaff/UserList";
import CreateUser from "./pages/estaff/CreateUser";
import EStaffDocumentsList from "./pages/estaff/EStaffDocumentsList";
import EstaffDashboard from "./pages/estaff/EstaffDashboard";
import EstaffViewDocument from "./pages/estaff/EstaffViewDocuments";
import ProjLeadDashboard from "./pages/projectlead/ProjLeadDashboard";
import ProjLeadRequirements from "./pages/projectlead/ProjLeadRequirements";
import ProjLeadAccReport from "./pages/projectlead/ProjLeadAccReport";
import ProjLeadCreateAccReport from "./pages/projectlead/ProjLeadCreateAccReport";
import ProjLeadDailyAttRec from "./pages/projectlead/ProjLeadDailyAttRec";
import ProjLeadListofParticipants from "./pages/projectlead/ProjLeadListofParticipants";
import ProjLeadTrainersCV from "./pages/projectlead/ProjLeadTrainersCV";
import ProjLeadLecNotes from "./pages/projectlead/ProjLeadLecNotes";
import ProjLeadOthers from "./pages/projectlead/ProjLeadOthers";
import Topbar from "./components/Topbar";
import DeptOffSideBar from './components/DeptOffSideBar';
import DeptOffDashboard from "./pages/deptoff/DeptOffDashboard";
import DeptOffGenerateDocument from "./pages/deptoff/DeptOffGenerateDocument";
import DeptOffProfilePage from "./pages/deptoff/DeptOffProfilePage";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import SignatoryDashboard from "./pages/signatory/SignatoryDashboard";
import EStaffProjects from "./pages/estaff/EStaffProjects";
import EStaffProjMonitoring from "./pages/estaff/EStaffProjMonitoring";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/user" element={ <ProjLeadDashboard /> } />
      <Route path="/estaff" element={ <EstaffDashboard /> } />
      <Route path="/deptoff" element={ <DeptOffDashboard /> } />
      <Route path="/coordinator" element={ <CoordinatorDashboard /> } />
      <Route path="/signatory" element={ <SignatoryDashboard /> } />
      <Route path="/requirements" element={<ProjLeadRequirements />} />
      <Route path="/requirements/accomplishment-report" element={<ProjLeadAccReport />} />
      <Route path="/requirements/create-accomplishment-report" element={<ProjLeadCreateAccReport />} />
      <Route path="/requirements/list-of-participants" element={<ProjLeadListofParticipants />} />
      <Route path="/requirements/daily-attendance" element={<ProjLeadDailyAttRec />} />
      <Route path="/requirements/trainer-cv" element={<ProjLeadTrainersCV />} />
      <Route path="/requirements/modules-notes" element={<ProjLeadLecNotes />} />
      <Route path="/requirements/others" element={<ProjLeadOthers />} />
      <Route path="/projects" element={<EStaffProjects />} />
      <Route path="/projects/monitoring" element={<EStaffProjMonitoring />} />
    </Routes>
  );
}

export default App;