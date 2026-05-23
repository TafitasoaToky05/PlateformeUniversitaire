from rest_framework import serializers
from django.db import transaction
from .models import *

# authentication/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer





# ==========================================
# MODULE 1 : UTILISATEURS ET COMPTES
# ==========================================
class UtilisateurSerializer(serializers.ModelSerializer):
    # Ampidirina eto ny password ary atao write_only mba ho fiarovana
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Utilisateur
        # Ampiana 'password' ny fields
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'password', 'date_creation']
        read_only_fields = ['id', 'date_creation']

    def create(self, validated_data):
        # Alaina ny password raha misy
        password = validated_data.pop('password', None)
        
        # Ampiasaina ny create_user fa tsy create tsotra mba hanaovana hash ny password
        user = Utilisateur.objects.create_user(**validated_data)
        
        if password:
            user.set_password(password)
            user.save()
            
        return user

    def update(self, instance, validated_data):
        # Alaina ny password raha toa ka manova teny miafina ny mpampiasa
        password = validated_data.pop('password', None)
        
        # Havaozina ny saha rehetra sisa
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance


class EnseignantSerializer(serializers.ModelSerializer):
    # Imbrique les détails de base (nom, prénom, email)
    user_details = UtilisateurSerializer(source='user', read_only=True)

    class Meta:
        model = Enseignant
        fields = ['user', 'user_details', 'specialite', 'bureau']


# ==========================================
# MODULE 2 : STRUCTURE ACADÉMIQUE
# ==========================================

class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = '__all__'


class EtudiantSerializer(serializers.ModelSerializer):
    # 'user_details' mampiseho ny mombamomba ny kaonty amin'ny antsipiriany rehefa mamaky data (GET)
    user_details = UtilisateurSerializer(source='user', read_only=True)

    class Meta:
        model = Etudiant
        # Ny '__all__' dia maka ny: id, user, matricule, annee_entree
        # Hiaraka mivoaka amin'izany koa ny 'user_details'
        fields = '__all__'
        
        # Koa satria généré automatique ny matricule, atao read_only izy mba tsy hidirana POST/PUT
        read_only_fields = ['id', 'matricule']

# ==========================================
# MODULE 3 : COURS ET INSCRIPTIONS
# ==========================================

class MatiereSerializer(serializers.ModelSerializer):
    # Présentation propre des données liées pour le front-end React
    enseignant_details = EnseignantSerializer(source='enseignant', read_only=True)
    filiere_details = FiliereSerializer(source='filiere', read_only=True)

    class Meta:
        model = Matiere
        fields = '__all__'

class InscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscription
        fields = ['id', 'etudiant', 'filiere', 'date_inscription']
        
        # Hamarino tsara fa manomboka amin'ny [ ary mifarana amin'ny ] ity ampahany ity
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Inscription.objects.all(),
                fields=['etudiant', 'filiere'], # Lisitra koa ity fields ato anatiny ity
                message="Cet étudiant est déjà inscrit à cette filière."
            )
        ]
        
# ==========================================
# MODULE 4 : COURS ET SYLLABUS
# ==========================================

class CoursSerializer(serializers.ModelSerializer):
    # Eto izy dia mampiasa an'ilay serializer teo ambony mba hampisehoana ny pitsopitsony
    matiere_details = MatiereSerializer(source='matiere', read_only=True)
    date_creation = serializers.DateTimeField(format="%d/%m/%Y %H:%M", read_only=True)

    class Meta:
        model = Cours
        fields = ['id', 'matiere', 'matiere_details', 'titre_cours', 'contenu', 'date_creation']    
        
# ==========================================
# MODULE : FICHIERS DE COURS
# ==========================================

class FichierCoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichierCours
        fields = ['id', 'cours', 'nom_fichier', 'fichier', 'date_ajout']
        read_only_fields = ['date_ajout']

    def create(self, validated_data):
        # Si le nom_fichier n'est pas fourni, on prend par défaut le nom du fichier d'origine
        if not validated_data.get('nom_fichier'):
            validated_data['nom_fichier'] = validated_data['fichier'].name
        return super().create(validated_data)
    
    
# ==========================================
# MODULE 4 : EXERCICES
# ==========================================
# Ao amin'ny serializers.py
class ExerciceSerializer(serializers.ModelSerializer):
    # Diniho tsara ny 'source' sy ny anarana
    matiere_details = MatiereSerializer(source='matiere', read_only=True)

    class Meta:
        model = Exercice
        # Aza mampiasa "__all__" fa tanisao mazava ny fields
        fields = ['id', 'matiere', 'matiere_details', 'titre_exercice', 'description', 'date_creation']
        read_only_fields = ['date_creation']
        
        
class FichierExerciceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichierExercice
        fields = "__all__"
        read_only_fields = ['date_televersement']
        
class SoumissionExerciceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoumissionExercice
        fields = ['id', 'exercice', 'etudiant', 'fichier_reponse', 'commentaire', 'date_soumission']
        read_only_fields = ['etudiant'] # L'étudiant est automatiquement pris depuis 'request.user'
        
# ==========================================
# MODULE 4 : EXAMENS
# ==========================================
class ExamenSerializer(serializers.ModelSerializer):
    code_matiere = serializers.CharField(source='matiere.code_matiere', read_only=True)
    titre_matiere = serializers.CharField(source='matiere.titre', read_only=True)

    class Meta:
        model = Examen
        fields = [
            'id', 'matiere', 'code_matiere', 'titre_matiere', 
            'titre_examen', 'description', 'date_creation', 'date_limite'
        ]
        read_only_fields = ['date_creation']
        
class FichierExamenSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichierExamen
        fields = "__all__"
        read_only_fields = ['date_televersement']

# ==========================================
# MODULE 4 : ÉVALUATIONS
# ==========================================

class NoteSerializer(serializers.ModelSerializer):
    etudiant_details = EtudiantSerializer(source='etudiant', read_only=True)
    matiere_details = MatiereSerializer(source='matiere', read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'etudiant', 'etudiant_details', 'matiere', 'matiere_details', 'valeur', 'type_evaluation']
        read_only_fields = ['id']


# ==========================================
# MODULE 5 : LOGISTIQUE ET PLANNING
# ==========================================

class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = '__all__'


class EmploiDuTempsSerializer(serializers.ModelSerializer):
    matiere_details = MatiereSerializer(source='matiere', read_only=True)
    salle_details = SalleSerializer(source='salle', read_only=True)

    class Meta:
        model = EmploiDuTemps
        fields = [
            'id', 'matiere', 'matiere_details', 'salle', 'salle_details', 
            'date_seance', 'heure_debut', 'heure_fin'
        ]
        read_only_fields = ['id']

#=========================================
# MODULE 6 : PRÉSENCE
#=========================================

class LignePresenceSerializer(serializers.ModelSerializer):
    # Ilaina amin'ny famoronana (POST)
    etudiant_id = serializers.PrimaryKeyRelatedField(
        queryset=Etudiant.objects.all(), 
        source='etudiant', 
        write_only=True
    )
    # Hiseho amin'ny famakiana data (GET)
    etudiant_nom = serializers.CharField(source='etudiant.user.last_name', read_only=True)
    etudiant_prenom = serializers.CharField(source='etudiant.user.first_name', read_only=True)
    matricule = serializers.CharField(source='etudiant.matricule', read_only=True)

    class Meta:
        model = LignePresence
        fields = ['id', 'etudiant_id', 'matricule', 'etudiant_nom', 'etudiant_prenom', 'statut', 'remarque']
        
        



class FeuillePresenceSerializer(serializers.ModelSerializer):
    # many=True satria feuille iray misy tsipika maromaro
    lignes = LignePresenceSerializer(many=True)
    matiere_titre = serializers.CharField(source='matiere.titre', read_only=True)

    class Meta:
        model = FeuillePresence
        fields = ['id', 'matiere', 'matiere_titre', 'date_cours', 'heure_debut', 'enseignant', 'lignes', 'date_creation']

    def create(self, validated_data):
        # Tsoahina avy ao amin'ny validated_data ny lisitry ny mpianatra
        lignes_data = validated_data.pop('lignes', [])
        
        # Ampiasaina ny transaction mba hamerenana ny zava-drehetra raha misy diso
        with transaction.atomic():
            feuille = FeuillePresence.objects.create(**validated_data)
            
            lignes_to_create = [
                LignePresence(feuille_presence=feuille, **ligne)
                for ligne in lignes_data
            ]
            
            if lignes_to_create:
                LignePresence.objects.bulk_create(lignes_to_create)
                
        return feuille
    
    
#   ==================================================
#   AUTHENTIFICATION
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Ampidirina ao anaty JWT payload ireto saha ireto mba ho hitan'ny React
        token['email'] = user.email
        token['username'] = user.username
        token['role'] = user.role  # 'admin', 'enseignant', 'etudiant'
        
        return token
    

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Création de l'utilisateur
        user = Utilisateur.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'etudiant')
        )
        
        # Si c'est un étudiant, on crée automatiquement son profil Etudiant
        if user.role == 'etudiant':
            # Note: matricule doit être généré ou envoyé, ici un exemple simple
            Etudiant.objects.create(user=user, matricule=f"MAT-{user.id}")
            
        return user