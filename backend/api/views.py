from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import *
from .serializers import *


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

# ==========================================
# MODULE 1 : UTILISATEURS
# ==========================================

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all().order_by('-date_creation')
    serializer_class = UtilisateurSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset


class EnseignantViewSet(viewsets.ModelViewSet):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer


# ==========================================
# MODULE 2 : STRUCTURE ACADÉMIQUE
# ==========================================

class FiliereViewSet(viewsets.ModelViewSet):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer

class EtudiantViewSet(viewsets.ModelViewSet):
    queryset = Etudiant.objects.select_related('user')
    serializer_class = EtudiantSerializer


# ==========================================
# MODULE 3 : MATIERE
# ==========================================
class MatiereViewSet(viewsets.ModelViewSet):
    serializer_class = MatiereSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if not user or user.is_anonymous:
            return Matiere.objects.none()

        # 1. Raha Admin dia mahita ny zava-drehetra
        if user.is_staff or user.is_superuser:
            return Matiere.objects.all()

        # 2. Raha Enseignant - Mampiasa 'profil_enseignant' (araka ny models.py)
        if hasattr(user, 'profil_enseignant'): 
            return Matiere.objects.filter(enseignant=user.profil_enseignant)

        # 3. Raha Etudiant - Mampiasa 'profil_etudiant' (araka ny models.py)
        if hasattr(user, 'profil_etudiant'):
            # Eto, ny Etudiant dia manana 'user' sy 'matricule' fa tsy manana 'filiere' mivantana ao amin'ny model Etudiant
            # Jereo ny model Etudiant anao: Tsy manana field 'filiere' izy fa ny 'Inscription' no manana azy.
            # Ka tsy maintsy miditra amin'ny 'Inscription' ianao raha te hahita ny filiere.
            
            # Fanitsiana: Makà ny filiere-ny avy amin'ny model Inscription
            filiere_ids = Inscription.objects.filter(etudiant=user.profil_etudiant).values_list('filiere', flat=True)
            return Matiere.objects.filter(filiere__in=filiere_ids)

        return Matiere.objects.none()
    
# ======================================================
# INSCRIPTIONS
# ======================================================

class InscriptionViewSet(viewsets.ModelViewSet):
    queryset = Inscription.objects.select_related(
        'etudiant',
        'filiere'
    )
    serializer_class = InscriptionSerializer
    
    

    
class CoursViewSet(viewsets.ModelViewSet):

    serializer_class = CoursSerializer

    def get_queryset(self):

        queryset = Cours.objects.all()

        matiere_id = self.request.query_params.get('matiere')

        if matiere_id:
            queryset = queryset.filter(matiere_id=matiere_id)

        return queryset
    
class FichierCoursViewSet(viewsets.ModelViewSet):
    queryset = FichierCours.objects.all()
    
    # CORRECTION ICI : Utilisez bien 'serializer_class'
    serializer_class = FichierCoursSerializer
    
    parser_classes = (MultiPartParser, FormParser)
    
    
# ==========================================
# MODULE 4 : ÉVALUATIONS
# ==========================================

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.select_related('etudiant', 'cours').all()
    serializer_class = NoteSerializer

    # Exemple de filtrage automatique : obtenir les notes d'un étudiant spécifique
    def get_queryset(self):
        queryset = self.queryset
        etudiant_id = self.request.query_params.get('etudiant', None)
        if etudiant_id is not None:
            queryset = queryset.filter(etudiant_id=etudiant_id)
        return queryset


# ==========================================
# MODULE 5 : LOGISTIQUE ET PLANNING
# ==========================================

class SalleViewSet(viewsets.ModelViewSet):
    queryset = Salle.objects.all()
    serializer_class = SalleSerializer


class EmploiDuTempsViewSet(viewsets.ModelViewSet):
    queryset = EmploiDuTemps.objects.select_related('cours', 'salle').all()
    serializer_class = EmploiDuTempsSerializer
    

# ==========================================
# MODULE 1 : EXERCICE
# ==========================================
# Ao amin'ny views.py
class ExerciceViewSet(viewsets.ModelViewSet):
    # Manampy .select_related('matiere') mba haka ny info rehetra momba ny matiere
    queryset = Exercice.objects.select_related('matiere').all()
    serializer_class = ExerciceSerializer
    
class FichierExerciceViewSet(viewsets.ModelViewSet):
    queryset = FichierExercice.objects.all()
    serializer_class = FichierExerciceSerializer
    parser_classes = (MultiPartParser, FormParser)
    
class SoumissionExerciceViewSet(viewsets.ModelViewSet):
    queryset = SoumissionExercice.objects.all()
    serializer_class = SoumissionExerciceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Associe automatiquement l'étudiant connecté à la soumission
        serializer.save(etudiant=self.request.user.profil_etudiant)


# ==========================================
# MODULE 1 : EXAMENS
# ==========================================
class ExamenViewSet(viewsets.ModelViewSet):
    queryset = Examen.objects.all()
    serializer_class = ExamenSerializer

class FichierExamenViewSet(viewsets.ModelViewSet):
    queryset = FichierExamen.objects.all()
    serializer_class = FichierExamenSerializer
    parser_classes = (MultiPartParser, FormParser)
    
# ==========================================
# MODULE 3 : PRÉSENCE
# ==========================================

class FeuillePresenceViewSet(viewsets.ModelViewSet):
    queryset = FeuillePresence.objects.all().order_by('-date_cours')
    serializer_class = FeuillePresenceSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                {"message": "Fandraisana anarana voatahiry soa aman-tsara!", "data": serializer.data}, 
                status=status.HTTP_201_CREATED, 
                headers=headers
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# ================================================
# AUTH
# ================================================

class RegisterView(APIView):
    # Autoriser l'inscription sans être connecté
    permission_classes = [] 

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Compte créé avec succès !"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class MyTokenObtainPairView(TokenObtainPairView):
    # Solointsika amin'ilay serializer namboarintsika ny default
    serializer_class = MyTokenObtainPairSerializer