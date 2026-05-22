import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// IMPORTS ADMIN 
import DashboardAdmin from './components/admin/DashboardAdmin';
import NavbarAdmin from './components/admin/NavbarAdmin';
import GestionUtilisateurs from './components/admin/GestionUtilisateurs';
import GestionAcademique from './components/admin/GestionAcademique';
import GestionCoursEDT from './components/admin/GestionCoursEDT';
import CommunicationAdmin from './components/admin/CommunicationAdmin';
import ControleNotes from './components/admin/ControleNotes';
import SecuriteBackups from './components/admin/SecuriteBackups';
import CreateFiliere from './components/admin/CreateFiliere';
import AjouterEnseignant from './components/admin/AjouterEnseignant';
import AjouterEtudiant from './components/admin/AjouterEtudiant';
import InscrireEtudiant from './components/admin/InscrireEtudiant';
import DetailsFiliere from './components/admin/DetailsFiliere';
import AjouterMatiere from './components/admin/AjouterMatiere';

// IMPORTS ENSEIGNANT 
import DashboardEnseignant from './components/enseignant/DashboardEnseignant';
import NavbarEnseignant from './components/enseignant/NavbarEnseignant';
import GestionMatiere from './components/enseignant/GestionMatiere';
import DetailsMatiere from './components/enseignant/DetailsMatiere';
import AjouterCours from './components/enseignant/AjouterCours';
import ImporterFichierSyllabus from './components/enseignant/ImporterFichierSyllabus';
import GestionExerciceExamen from './components/enseignant/GestionExerciceExamen';
import DetailsExamenDevoir from './components/enseignant/DetailsExamenDevoir';
import AjouterExercice from './components/enseignant/AjouterExercice';
import AjouterExamen from './components/enseignant/AjouterExamen';
import ImporterFichiersExercice from './components/enseignant/ImporterFichiersExercice';
import ImporterFichiersExamen from './components/enseignant/ImporterFichiersExamen';
import GestionPresence from './components/enseignant/GestionPresence';
import DetailsPresence from './components/enseignant/DetailsPresence';
import AjouterPresence from './components/enseignant/AjouterPresence';
import NavbarEtudiant from './components/etudiants/NavbarEtudiant';
import DashboardEtudiant from './components/etudiants/DashboardEtudiant';
import SuiviMatiere from './components/etudiants/SuiviMatiere';
import SuiviDetailsMatiere from './components/etudiants/DetailsSuiviMatiere';
import SuiviExerciceExamen from './components/etudiants/SuiviExerciceExamen';
import DetailsSuiviMatiere from './components/etudiants/DetailsSuiviMatiere';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Ny mombamomba anao dia eo am-pikarohana...
      </div>
    );
  }

  // Fonction utilitaire pour centraliser les redirections
  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin/dashboard-admin';
    if (role === 'enseignant') return '/enseignant/dashboard';
    if (role === 'etudiant') return '/etudiant/etudiant-dashboard';
    return '/login';
  };

  return (
    <Routes>
      {/* PAGES PUBLIQUES */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to={getDashboardPath(user.role)} replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to={getDashboardPath(user.role)} replace />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ADMIN */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <NavbarAdmin>
            <Routes>
              <Route path="dashboard-admin" element={<DashboardAdmin />} />
              <Route path="gestion-utilisateurs" element={<GestionUtilisateurs />} />
              <Route path="architecture-academique" element={<GestionAcademique />} />
              <Route path="admin-cours" element={<GestionCoursEDT />} />
              <Route path="ajouter-matiere" element={<AjouterMatiere />} />
              <Route path="admin-communication" element={<CommunicationAdmin />} />
              <Route path="controle-notes" element={<ControleNotes />} />
              <Route path="securite-backups" element={<SecuriteBackups />} />
              <Route path="ajouter-filiere" element={<CreateFiliere />} />
              <Route path="ajouter-enseignant" element={<AjouterEnseignant />} />
              <Route path="ajouter-etudiant" element={<AjouterEtudiant />} />
              <Route path="inscrire-etudiant" element={<InscrireEtudiant />} />
              <Route path="details-filiere/:id" element={<DetailsFiliere />} />
              <Route path="*" element={<Navigate to="dashboard-admin" replace />} />
            </Routes>
          </NavbarAdmin>
        </ProtectedRoute>
      } />

      {/* ENSEIGNANT */}
      <Route path="/enseignant/*" element={
        <ProtectedRoute allowedRoles={['enseignant']}>
          <NavbarEnseignant>
            <Routes>
              <Route path="dashboard" element={<DashboardEnseignant />} />
              <Route path="gestion-matieres" element={<GestionMatiere />} />
              <Route path="details-matieres/:id" element={<DetailsMatiere />} />
              <Route path="ajouter-cours" element={<AjouterCours />} />
              <Route path="importer-fichier-syllabus/:id" element={<ImporterFichierSyllabus />} />
              <Route path="gestion-exercices-examens" element={<GestionExerciceExamen />} />
              <Route path="details-examen-devoir/:id" element={<DetailsExamenDevoir />} />
              <Route path="ajouter-exercice/:matiereId" element={<AjouterExercice />} />
              <Route path="ajouter-examen/:matiereId" element={<AjouterExamen />} />
              <Route path="importer-fichier-exercice/:exerciceId" element={<ImporterFichiersExercice />} />
              <Route path="importer-fichier-examen/:examenId" element={<ImporterFichiersExamen />} />
              <Route path="presence" element={<GestionPresence />} />
              <Route path="details-presence/:id" element={<DetailsPresence />} />
              <Route path="ajouter-presence/:id" element={<AjouterPresence />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </NavbarEnseignant>
        </ProtectedRoute>
      } />

      {/* ETUDIANT */}
      <Route path="/etudiant/*" element={
        <ProtectedRoute allowedRoles={['etudiant']}>
          <NavbarEtudiant>
            <Routes>
              <Route path="etudiant-dashboard" element={<DashboardEtudiant />} />
              {/* Redirection si l'étudiant tape une mauvaise URL interne */}
              <Route path="*" element={<Navigate to="etudiant-dashboard" replace />} />
              <Route path='suivi-matiere' element={<SuiviMatiere/>} />
              <Route path='suivi-details-matiere/:id' element={<DetailsSuiviMatiere/>} />
              <Route path='suivi-examen-exercice' element={<SuiviExerciceExamen/>} />
            </Routes>
          </NavbarEtudiant>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}