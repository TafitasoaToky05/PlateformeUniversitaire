from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


# ======================
# Utilisateur
# ======================

class Utilisateur(AbstractUser):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('enseignant', 'Enseignant'),
        ('etudiant', 'Etudiant'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return self.username


# ======================
# Filiere
# ======================

class Filiere(models.Model):

    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom


# ======================
# Etudiant
# ======================

class Etudiant(models.Model):

    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE
    )

    matricule = models.CharField(max_length=50)

    filiere = models.ForeignKey(
        Filiere,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.matricule


# ======================
# Enseignant
# ======================

class Enseignant(models.Model):

    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE
    )

    specialite = models.CharField(max_length=100)

    def __str__(self):
        return self.utilisateur.username


# ======================
# Cours
# ======================

class Cours(models.Model):

    titre = models.CharField(max_length=100)

    description = models.TextField()

    enseignant = models.ForeignKey(
        Enseignant,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.titre


# ======================
# Note
# ======================

class Note(models.Model):

    etudiant = models.ForeignKey(
        Etudiant,
        on_delete=models.CASCADE
    )

    cours = models.ForeignKey(
        Cours,
        on_delete=models.CASCADE
    )

    valeur = models.FloatField()

    def __str__(self):
        return str(self.valeur)