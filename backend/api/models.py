import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

# ==========================================
# MODULE 1 : UTILISATEURS ET ROLES
# ==========================================

class Utilisateur(AbstractUser):
    class Role(models.TextChoices):
        ETUDIANT = 'etudiant', 'Étudiant'
        ENSEIGNANT = 'enseignant', 'Enseignant'
        ADMIN = 'admin', 'Administrateur'

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20, 
        choices=Role.choices, 
        default=Role.ETUDIANT
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    # On utilise l'email pour la connexion à la place du username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"


class Enseignant(models.Model):
    user = models.OneToOneField(
        Utilisateur, 
        on_delete=models.CASCADE, 
        primary_key=True,
        related_name='profil_enseignant'
    )
    specialite = models.CharField(max_length=100, blank=True)
    bureau = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"Pr. {self.user.last_name}"


# ==========================================
# MODULE 2 : STRUCTURE ACADÉMIQUE
# ==========================================
class Filiere(models.Model):
    NIVEAU_CHOICES = [
        ('L1', 'Licence 1'),
        ('L2', 'Licence 2'),
        ('L3', 'Licence 3'),
        ('M1', 'Master 1'),
        ('M2', 'Master 2'),
        ('D', 'Doctorat'),
    ]

    nom_filiere = models.CharField(max_length=100) # Ex: "Informatique"
    niveau = models.CharField(max_length=2, choices=NIVEAU_CHOICES, default='L1')
    annee_academique = models.CharField(max_length=9) # Ex: "2025-2026"

    class Meta:
        # Lasa tsy manam-paharoa ny fitambaran'ny anarana, niveau ary taona
        unique_together = ('nom_filiere', 'niveau', 'annee_academique')

    def __str__(self):
        return f"{self.nom_filiere} {self.get_niveau_display()} [{self.annee_academique}]"

# =====================================================================
# 2. MODEL ETUDIANT
# =====================================================================
class Etudiant(models.Model):
    # OneToOneField: Ny User iray dia manana profil Etudiant iray ihany
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='profil_etudiant')
    
    # Saha manokana ho an'ny mpianatra
    matricule = models.CharField(max_length=20, unique=True)
    annee_entree = models.IntegerField(default=2026)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.matricule})"

# ==========================================
# MODULE 3 : MATIERES ET INSCRIPTIONS
# ==========================================
class Matiere(models.Model):
    code_matiere = models.CharField(max_length=10, unique=True)
    titre = models.CharField(max_length=150)
    credits_ects = models.IntegerField(default=6)
    enseignant = models.ForeignKey(
        Enseignant, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='cours_dispenses'
    )
    filiere = models.ForeignKey(
        Filiere, 
        on_delete=models.CASCADE, 
        related_name='cours_au_programme'
    )
    
    # NAHITSY: Nesorina ilay through='Inscription'. 
    # Django izao no hitantana ny tabilao kely mampitohy azy roa ho azy.
    etudiants_inscrits = models.ManyToManyField(
        Etudiant, 
        related_name='cours_suivis',
        blank=True
    )

    def __str__(self):
        return f"{self.code_matiere} : {self.titre}"


class Inscription(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE)
    date_inscription = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('etudiant', 'filiere') # Clé primaire composite conceptuelle

    def __str__(self):
        return f"{self.etudiant} inscrit à {self.filiere}"
    

# ==========================================
# MODULE 4 : COURS
# ==========================================
class Cours(models.Model):
    # Ny ForeignKey eto no mamela ny Matiere iray hanana Cours maromaro
    # Ny related_name='cours' dia ahafahana miantso ny cours rehetra avy amin'ny matiere
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE, related_name='cours')
    titre_cours = models.CharField(max_length=255)
    contenu = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre_cours} ({self.matiere.code_matiere})"
    
    
# ==========================================
# MODULE 4 : FICHIERS DE COURS
# ==========================================

def get_upload_path(instance, filename):
    # Alamina tsara ny toerana hitehirizana ny rakitra: media/cours_files/code_matiere/filename
    return os.path.join('cours_files', instance.cours.matiere.code_matiere, filename)
class FichierCours(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='fichiers')
    nom_fichier = models.CharField(max_length=255, blank=True, null=True)
    
    # OVAY HO upload_to ITY AKANJO AMBANY ITY:
    fichier = models.FileField(upload_to=get_upload_path) 
    
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom_fichier or f"Fichier de {self.cours.titre_cours}"


# ==========================================
# MODULE 4 : EXERCICES
# ==========================================
class Exercice(models.Model):
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE, related_name='exercices')
    titre_exercice = models.CharField(max_length=255)
    description = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre_exercice} ({self.matiere.code_matiere})"
    
class FichierExercice(models.Model):
    exercice = models.ForeignKey(Exercice, on_delete=models.CASCADE, related_name='fichiers')
    fichier = models.FileField(upload_to='exercices/')
    date_televersement = models.DateTimeField(auto_now_add=True)
    
    
# ... dans models.py ...

class SoumissionExercice(models.Model):
    exercice = models.ForeignKey(Exercice, on_delete=models.CASCADE, related_name='soumissions')
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='travaux_rendus')
    fichier_reponse = models.FileField(upload_to='soumissions_exercices/')
    commentaire = models.TextField(blank=True, null=True)
    date_soumission = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Empêche un étudiant de soumettre plusieurs fois pour le même exercice (optionnel)
        unique_together = ('exercice', 'etudiant')

    def __str__(self):
        return f"{self.etudiant.user.last_name} - {self.exercice.titre_exercice}"


#==========================================
# MODULE 4 : EXAMENS
# ==========================================
class Examen(models.Model):
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE, related_name='examens')
    titre_examen = models.CharField(max_length=255)
    description = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    date_limite = models.DateTimeField(auto_now=False, auto_now_add=False)

    def __str__(self):
        return f"{self.titre_examen} ({self.matiere.code_matiere})"
class FichierExamen(models.Model):
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE, related_name='fichiers')
    fichier = models.FileField(upload_to='examens/')
    date_televersement = models.DateTimeField(auto_now_add=True)


# ==========================================
# MODULE 4 : ÉVALUATIONS
# ==========================================
class Note(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='notes')
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE, related_name='notes_cours')
    valeur = models.DecimalField(
        max_digits=4,
        decimal_places=2, 
        validators=[MinValueValidator(0.0), MaxValueValidator(20.0)]
    )
    type_evaluation = models.CharField(max_length=50) # Ex: "Examen Final", "CC1"

    def __str__(self):
        # NAHITSY: code_cours novaina ho code_matiere mifanaraka amin'ny modely Matiere
        return f"{self.etudiant.user.last_name} - {self.matiere.code_matiere} : {self.valeur}/20"


# ==========================================
# MODULE 5 : LOGISTIQUE ET PLANNING
# ==========================================
class Salle(models.Model):
    nom_salle = models.CharField(max_length=50)
    capacite = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.nom_salle} (Capacité: {self.capacite})"


class EmploiDuTemps(models.Model):
    matiere = models.ForeignKey(Matiere, on_delete=models.CASCADE, related_name='seances')
    salle = models.ForeignKey(Salle, on_delete=models.CASCADE, related_name='reservations')
    date_seance = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()

    class Meta:
        verbose_name = "Séance de cours"
        verbose_name_plural = "Emploi du temps"

    def __str__(self):
        # NAHITSY: code_cours novaina ho code_matiere mifanaraka amin'ny modely Matiere
        return f"{self.matiere.code_matiere} le {self.date_seance} ({self.heure_debut}-{self.heure_fin})"
    

# ==========================================
# MODULE 5 : PRESENCE
# ==========================================

class FeuillePresence(models.Model):
    """
    Ity ny modely lehibe (En-tête) ho an'ny FeuillePresenceSerializer
    """
    matiere = models.ForeignKey(
        Matiere, 
        on_delete=models.CASCADE, 
        related_name='feuilles_presence'
    )
    date_cours = models.DateField()
    heure_debut = models.TimeField(blank=True, null=True)
    enseignant = models.ForeignKey(
        Enseignant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='feuilles_presence_validees'
    )
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('matiere', 'date_cours', 'heure_debut')

    def __str__(self):
        return f"Présence {self.matiere.titre} - {self.date_cours}"


class LignePresence(models.Model):
    """
    Ity ny modely ho an'ny tsipika tsirairay (LignePresenceSerializer)
    Mampifandray ny mpianatra iray amin'ny FeuillePresence iray.
    """
    class StatutPresence(models.TextChoices):
        PRESENT = 'PRESENT', 'Présent'
        ABSENT = 'ABSENT', 'Absent'
        RETARD = 'RETARD', 'En Retard'

    feuille_presence = models.ForeignKey(
        FeuillePresence, 
        on_delete=models.CASCADE, 
        related_name='lignes' # Ny 'lignes' eto no ahafahan'ny FeuillePresenceSerializer mamaky ny many=True
    )
    etudiant = models.ForeignKey(
        Etudiant, 
        on_delete=models.CASCADE, 
        related_name='presences'
    )
    statut = models.CharField(
        max_length=10, 
        choices=StatutPresence.choices, 
        default=StatutPresence.PRESENT
    )
    remarque = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('feuille_presence', 'etudiant') # Tsy afaka miverina indroa ny mpianatra iray amin'ny feuille iray

    def __str__(self):
        return f"{self.etudiant.user.last_name} - {self.statut}"
    
    
    
    
