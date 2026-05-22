from django.contrib import admin
from .models import *

admin.site.register(Utilisateur)
admin.site.register(Enseignant)
admin.site.register(Filiere)
admin.site.register(Etudiant)
admin.site.register(Matiere)
admin.site.register(Cours)
admin.site.register(Note)
admin.site.register(Examen)
admin.site.register(Exercice)
admin.site.register(FichierExamen)
admin.site.register(FichierExercice)


