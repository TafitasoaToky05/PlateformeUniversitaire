from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView
# Nampiana ny import an'ilay custom view-nao eto
from .views import (
    UtilisateurViewSet, EnseignantViewSet, FiliereViewSet, EtudiantViewSet,
    MatiereViewSet, InscriptionViewSet, NoteViewSet, SalleViewSet,
    EmploiDuTempsViewSet, CoursViewSet, FichierCoursViewSet, ExerciceViewSet,
    ExamenViewSet, FichierExerciceViewSet, FichierExamenViewSet,
    FeuillePresenceViewSet, MyTokenObtainPairView  
)

# Création du routeur DRF
router = DefaultRouter()

# Enregistrement des ViewSets
router.register(r'utilisateurs', UtilisateurViewSet, basename='utilisateur')
router.register(r'enseignants', EnseignantViewSet, basename='enseignant')
router.register(r'filieres', FiliereViewSet, basename='filiere')
router.register(r'etudiants', EtudiantViewSet, basename='etudiant')
router.register(r'matieres', MatiereViewSet, basename='matiere')
router.register(r'inscriptions', InscriptionViewSet, basename='inscription')
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'salles', SalleViewSet, basename='salle')
router.register(r'planning', EmploiDuTempsViewSet, basename='planning')
router.register(r'cours', CoursViewSet, basename='cours')
router.register(r'fichiers-cours', FichierCoursViewSet, basename='fichier-cours')
router.register(r'exercices', ExerciceViewSet, basename='exercice')
router.register(r'examens', ExamenViewSet, basename='examen')
router.register(r'fichiers-exercices', FichierExerciceViewSet, basename='fichier-exercice')
router.register(r'fichiers-examens', FichierExamenViewSet, basename='fichier-examen')
router.register(r'presences', FeuillePresenceViewSet, basename='presence')

# NATAMBATRA HO IRAY NY URLPATTERNS DAHOLO
urlpatterns = [
    # 1. Ireo lalana ho an'ny Authentification (JWT) - NESORINA NY '/' EO ALOHA
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    
    # 2. Ireo lalana rehetra avy amin'ny ViewSets (Router)
    path('', include(router.urls)),
]