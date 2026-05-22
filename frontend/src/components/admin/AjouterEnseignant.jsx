import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
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
import { PersonAdd } from '@mui/icons-material';
import axiosInstance from '../api/axios'; // Ovay araka ny path-nao ny fifandraisana

export default function AddEnseignant() {
    // 1. Ny angon-drakitra alefa amin'ny POST (user handray ny ID an'ilay Utilisateur)
    const [formData, setFormData] = useState({
        user: '', // ID an'ny Utilisateur
        specialite: '',
        bureau: ''
    });

    // Lisitry ny mpampiasa (Utilisateurs) azo fidina ho lasa mpampianatra
    const [utilisateurs, setUtilisateurs] = useState([]);


    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook pour la navigation après création réussie

    // 2. Maka ny lisitry ny Utilisateurs Enseignants rehefa misokatra ny pejy
    useEffect(() => {

        const fetchEnseignants = async () => {

            try {
                const response = await axiosInstance.get(
                    '/utilisateurs/?role=enseignant'
                );

                setUtilisateurs(response.data);

            } catch (err) {
                console.error("Erreur chargement enseignants", err);
            }
        };

        fetchEnseignants();

    }, []);

    // 3. Mitantana ny fanovana rehetra ao amin'ny input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 4. Fandefasana ny formulaire (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Mandefa ny POST mankany amin'ny endpoint an'ny Enseignant
            const response = await axiosInstance.post('/enseignants/', formData);

            setMessage({
                type: 'success',
                text: `Le profil enseignant a été créé avec succès !`
            });

            // Réinitialisation du formulaire
            setFormData({ user: '', specialite: '', bureau: '' });

            // Navigation vers la page de liste des enseignants
            navigate('/admin-cours');

        } catch (error) {
            if (error.response) {
                // Famakiana ny fahadisoana avy amin'ny DRF
                const data = error.response.data;

                // Raha efa manana profil Enseignant ilay user (OneToOneField constraint)
                if (data.user) {
                    setMessage({
                        type: 'error',
                        text: `Erreur : Cet utilisateur a déjà un profil enseignant.`
                    });
                } else {
                    const errorText = Object.entries(data)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                        .join(' | ');
                    setMessage({ type: 'error', text: `Erreur : ${errorText}` });
                }
            } else {
                setMessage({ type: 'error', text: 'Impossible de joindre le serveur backend.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="#1e293b">
                Créer un Profil Enseignant
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Associez un compte utilisateur existant à un profil d'enseignant avec sa spécialité et son bureau.
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, boxShadow: 1, borderRadius: 2 }}>
                <Stack spacing={3}>

                    {/* Sélection de l'Utilisateur (Clé Primaire / OneToOneField) */}
                    <TextField
                        select
                        label="Sélectionner l'Utilisateur"
                        name="user"
                        value={formData.user}
                        onChange={handleChange}
                        required
                        fullWidth
                    >
                        {utilisateurs.length === 0 ? (
                            <MenuItem disabled value="">Aucun utilisateur disponible</MenuItem>
                        ) : (
                            utilisateurs.map((u) => (
                                <MenuItem key={u.id} value={u.id}>
                                    {u.last_name ?  `${u.first_name} ${u.last_name}` : u.username}
                                </MenuItem>
                            ))
                        )}
                    </TextField>

                    {/* Champ Spécialité */}
                    <TextField
                        label="Spécialité"
                        name="specialite"
                        placeholder="Ex: Internet of Things, Data Science, etc."
                        value={formData.specialite}
                        onChange={handleChange}
                        inputProps={{ maxLength: 100 }} // Mitovy amin'ny max_length an'ny Django
                        fullWidth
                    />

                    {/* Champ Bureau */}
                    <TextField
                        label="Code du Bureau"
                        name="bureau"
                        placeholder="Ex: Labo B-210"
                        value={formData.bureau}
                        onChange={handleChange}
                        inputProps={{ maxLength: 20 }} // Mitovy amin'ny max_length an'ny Django
                        fullWidth
                    />

                    {/* Bouton de validation */}
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<PersonAdd />}
                        disabled={loading}
                        sx={{ bgcolor: '#2563eb', py: 1.2, fontWeight: 'bold' }}
                        fullWidth
                    >
                        {loading ? 'Création en cours...' : 'Créer le profil Enseignant'}
                    </Button>

                </Stack>
            </Paper>
        </Box>
    );
}