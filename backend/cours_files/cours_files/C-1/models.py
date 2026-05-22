from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "UTILISATEUR"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(50))
    prenoms = Column(String(50))
    email = Column(String(100), unique=True)
    mot_de_passe = Column(String(255))
    role = Column(String(20))

class Course(Base):
    __tablename__ = "COURS"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True)
    titre = Column(String(100))
    description = Column(String(255))

class Inscription(Base):
    __tablename__ = "INSCRIPTION"
    id = Column(Integer, primary_key=True, index=True)
    etudiant_id = Column(Integer, ForeignKey("UTILISATEUR.id"))
    cours_id = Column(Integer, ForeignKey("COURS.id"))
    
    # Relations pour faciliter les jointures
    etudiant = relationship("User")
    cours = relationship("Course")

class Note(Base):
    __tablename__ = "NOTE"
    id = Column(Integer, primary_key=True, index=True)
    inscription_id = Column(Integer, ForeignKey("INSCRIPTION.id"))
    valeur = Column(Float)
    commentaries = Column(String(255))
    
    inscription = relationship("Inscription")