import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Paper,
    Stack,
    Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom'; // Hook pour la navigation
import axiosInstance from '../api/axios'; 

export default function CreateFiliere() {
    // 1. Initialisation de l'état en corrélation exacte avec le modèle Django
    const [formData, setFormData] = useState({
        nom_filiere: '',
        niveau: 'L1', // Valeur par défaut ('L1') définie dans votre modèle Django
        annee_academique: '2025-2026' // Exemple de format par défaut
    });


    const navigate = useNavigate(); // Hook pour la navigation après création réussie

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // NAHITSY: Nesorina ny Doctorat ('D') satria tsy misy ao amin'ny NIVEAU_CHOICES an'ny Django
    const niveauChoices = [
        { value: 'L1', label: 'Licence 1' },
        { value: 'L2', label: 'Licence 2' },
        { value: 'L3', label: 'Licence 3' },
        { value: 'M1', label: 'Master 1' },
        { value: 'M2', label: 'Master 2' },
    ];

    // 2. Gestion des changements des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 3. Soumission vers l'API Django amin'ny fampiasana axiosInstance
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Efa mandeha tsara izao satria efa nampidirina teo ambony ny axiosInstance
            const response = await axiosInstance.post('/filieres/', formData);

            // Raha mahomby (Status 201 na 200)
            setMessage({ type: 'success', text: 'Filière créée avec succès !' });

            // Réinitialisation du formulaire
            setFormData({ nom_filiere: '', niveau: 'L1', annee_academique: '2025-2026' });

            // Navigation vers la liste des filières après une courte pause pour afficher le message de succès
            setTimeout(() => {
                navigate('/admin/architecture-academique'); // Assurez-vous que ce chemin correspond à votre route de gestion académique
            }, 1500);

        } catch (error) {
            // Rehefa misy fahadisoana (Status 400, 403, 500, sns.)
            if (error.response) {
                const data = error.response.data;

                // Fitantanana manokana ny unique_together (non_field_errors)
                if (error.response.status === 400 && data.non_field_errors) {
                    setMessage({
                        type: 'error',
                        text: "Erreur : Cette combinaison (Nom, Niveau, Année) existe déjà."
                    });
                } else {
                    // Famakiana ny fahadisoana isaky ny saha (Field validation errors)
                    const errorText = Object.entries(data)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                        .join(' | ');
                    setMessage({ type: 'error', text: `Erreur : ${errorText}` });
                }
            } else if (error.request) {
                setMessage({ type: 'error', text: 'Impossible de joindre le serveur backend.' });
            } else {
                setMessage({ type: 'error', text: error.message });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="#1e293b">
                Créer une Nouvelle Filière
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ajoutez un parcours académique associé à un niveau et une année universitaire.
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, boxShadow: 1, borderRadius: 2 }}>
                <Stack spacing={3}>

                    {/* Champ Nom de la Filière */}
                    <TextField
                        label="Nom de la filière"
                        name="nom_filiere"
                        variant="outlined"
                        placeholder="Ex: Informatique ou Internet of Things"
                        value={formData.nom_filiere}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    {/* Champ Niveau (Menu déroulant Select) */}
                    <TextField
                        select
                        label="Niveau"
                        name="niveau"
                        value={formData.niveau}
                        onChange={handleChange}
                        required
                        fullWidth
                    >
                        {niveauChoices.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Champ Année Académique */}
                    <TextField
                        label="Année Académique"
                        name="annee_academique"
                        variant="outlined"
                        placeholder="Ex: 2025-2026"
                        inputProps={{ maxLength: 9 }}
                        value={formData.annee_academique}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    {/* Bouton de soumission */}
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Add />}
                        disabled={loading}
                        sx={{ bgcolor: '#2563eb', py: 1.2, fontWeight: 'bold' }}
                        fullWidth
                    >
                        {loading ? 'Création en cours...' : 'Ajouter la filière'}
                    </Button>

                </Stack>
            </Paper>
        </Box>
    );
}