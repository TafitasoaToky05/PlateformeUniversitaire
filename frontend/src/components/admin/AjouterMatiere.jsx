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
import { PostAdd } from '@mui/icons-material';
import axiosInstance from '../api/axios'; 

export default function AjouterMatiere() {
    // 1. Ny angon-drakitra alefa amin'ny POST
    const [formData, setFormData] = useState({
        code_matiere: '',
        titre: '',
        credits_ects: 1,
        enseignant: '', 
        filiere: ''     
    });



    const [enseignants, setEnseignants] = useState([]);
    const [filieres, setFilieres] = useState([]);
    
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook pour la navigation après création réussie
    // 2. Maka ny lisitry ny mpampianatra sy filières rehefa misokatra ny pejy
    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [resEnseignants, resFilieres] = await Promise.all([
                    axiosInstance.get('/enseignants/'), 
                    axiosInstance.get('/filieres/')
                ]);
                setEnseignants(resEnseignants.data);
                setFilieres(resFilieres.data);
            } catch (err) {
                console.error("Erreur de chargement des dépendances", err);
                setMessage({ type: 'error', text: 'Erreur lors du chargement des données initiales.' });
            }
        };
        fetchDependencies();
    }, []);

    // 3. Mitantana ny fanovana isaky ny saha input
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: name === 'credits_ects' ? (value === '' ? '' : parseInt(value, 10)) : value
        });
    };

    // 4. Fandefasana ny formulaire (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const payload = {
            ...formData,
            enseignant: formData.enseignant === "" ? null : formData.enseignant,
            filiere: formData.filiere === "" ? null : formData.filiere,
        };

        try {
            const response = await axiosInstance.post('/matieres/', payload);

            setMessage({ type: 'success', text: `La matière "${response.data.titre}" a été créée avec succès !` });

            // Réinitialisation du formulaire
            setFormData({ code_matiere : '', titre: '', credits_ects: 1, enseignant: '', filiere: '' });

            navigate('/admin/admin-cours'); // Navigation vers la liste des cours après création réussie

        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                const errorText = Object.entries(data)
                    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                    .join(' | ');
                setMessage({ type: 'error', text: `Erreur : ${errorText}` });
            } else {
                setMessage({ type: 'error', text: 'Impossible de joindre le serveur.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="#1e293b">
                Créer une Nouvelle Matière (UE)
            </Typography>
            
            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, boxShadow: 1, borderRadius: 2 }}>
                <Stack spacing={3}>
                    
                    {/* Code du cours */}
                    <TextField
                        label="Code du matière"
                        name="code_matiere"
                        placeholder="Ex: INF-401"
                        value={formData.code_matiere}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    {/* Titre du cours */}
                    <TextField
                        label="Intitulé de la matière"
                        name="titre"
                        placeholder="Ex: Sécurité des architectures IoT"
                        value={formData.titre}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    {/* Crédits ECTS */}
                    <TextField
                        label="Crédits ECTS"
                        name="credits_ects"
                        type="number"
                        inputProps={{ min: 1, max: 30 }}
                        value={formData.credits_ects}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    {/* Sélection de la Filière */}
                    <TextField
                        select
                        label="Filière rattachée"
                        name="filiere"
                        value={formData.filiere}
                        onChange={handleChange}
                        required
                        fullWidth
                    >
                        {/* INY NO NAHITSY: Asiana MenuItem banga mifanaraka amin'ny value="" ho an'ny MUI */}
                        <MenuItem value="" disabled>
                            <em>Veuillez choisir une filière</em>
                        </MenuItem>
                        {filieres.map((fil) => (
                            <MenuItem key={fil.id} value={fil.id}>
                                {fil.nom_filiere} ({fil.niveau})
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Sélection de l'Enseignant */}
                    <TextField
                        select
                        label="Enseignant Responsable (Optionnel)"
                        name="enseignant"
                        value={formData.enseignant}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="">
                            <em>Aucun (À assigner ultérieurement)</em>
                        </MenuItem>
                        {enseignants.map((ens) => {
                            const firstName = ens.user_details?.first_name || '';
                            const lastName = ens.user_details?.last_name || '';
                            const fullName = `${firstName} ${lastName}`.trim();
                            
                            // Ampiasaina ny ens.user (na ens.id ho fiarovana)
                            const enseignantId = ens.user || ens.id; 

                            return (
                                <MenuItem key={enseignantId} value={enseignantId}>
                                    {fullName || ens.specialite || `Enseignant ID: ${enseignantId}`}
                                </MenuItem>
                            );
                        })}
                    </TextField>

                    {/* Bouton de validation */}
                    <Button 
                        type="submit" 
                        variant="contained" 
                        startIcon={<PostAdd />}
                        disabled={loading}
                        sx={{ bgcolor: '#2563eb', py: 1.2, fontWeight: 'bold' }}
                        fullWidth
                    >
                        {loading ? 'Enregistrement en cours...' : 'Créer la matière'}
                    </Button>

                </Stack>
            </Paper>
        </Box>
    );
}