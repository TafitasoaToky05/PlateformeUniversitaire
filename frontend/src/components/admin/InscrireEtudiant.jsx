import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, MenuItem,
    Paper, Grid, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { ArrowBack, PersonAdd } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function InscrireEtudiant() {
    const navigate = useNavigate();

    // Id an'ny Utilisateur, Matricule, ary Taona nidirana
    const [userId, setUserId] = useState('');
    const [matricule, setMatricule] = useState(''); // <--- Nampiana ity state ity
    const [anneeEntree, setAnneeEntree] = useState(2026);

    // Tahiry ho an'ny lisitry ny Utilisateurs
    const [utilisateurs, setUtilisateurs] = useState([]);

    // States hitantanana ny loading sy ny fahadisoana
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Alaina ny lisitry ny utilisateurs rehefa misokatra ny pejy
    useEffect(() => {
        axiosInstance.get("utilisateurs/")
            .then(res => {
                // Sivana ny manana role 'etudiant' ary mbola tsy manana profil
                const lisitraMpanjifa = res.data.filter(u => u.role === 'etudiant' && !u.profil_etudiant);
                setUtilisateurs(lisitraMpanjifa);
                setLoadingData(false);
            })
            .catch(err => {
                console.error("Erreur chargement utilisateurs:", err);
                setError("Tsy tontosa ny fangalana ny lisitry ny mpampiasa.");
                setLoadingData(false);
            });
    }, []);

    // Fandefasana ny formulaire any amin'ny API
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!userId || !matricule.trim()) {
            setError("Fenoy tsara ny saha rehetra azafady.");
            return;
        }

        setSubmitting(true);
        setError(null);

        // Nampidirina ao anatin'ny payload ny matricule
        const dataEtudiant = {
            user: userId, 
            matricule: matricule, // <--- Alefa any amin'ny backend
            annee_entree: anneeEntree
        };

        axiosInstance.post("etudiants/", dataEtudiant)
            .then(res => {
                setSubmitting(false);
                setSuccess(true);
                setUserId('');
                setMatricule('');

                setTimeout(() => {
                    navigate('/architecture-academique');
                }, 2000);
            })
            .catch(err => {
                console.error("Erreur ajout profil etudiant:", err);
                setSubmitting(false);
                
                if (err.response?.data) {
                    const backendErrors = err.response.data;
                    if (typeof backendErrors === 'object') {
                        const messages = Object.entries(backendErrors)
                            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
                            .join(' | ');
                        setError(messages);
                    } else {
                        setError("Nisy olana teo am-pampiarahana ity profil ity.");
                    }
                } else {
                    setError("Nisy olana teo am-pampiarahana ity profil ity. Hamarino ny fifandraisana (Network).");
                }
            });
    };

    if (loadingData) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">Chargement en cours...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
            <Button
                component={Link}
                to="/architecture-academique"
                startIcon={<ArrowBack />}
                sx={{ mb: 3, color: '#64748b', textTransform: 'none' }}
            >
                Retour
            </Button>

            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Créer un Profil Étudiant
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Fenoy ireto saha manaraka ireto mba hamoronana ny mombamomba ny mpianatra.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
                <Grid container spacing={3}>

                    {/* 1. SELECTION DE L'UTILISATEUR */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Sélectionner l'Utilisateur"
                            fullWidth
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            helperText="Ireo kaonty tsy mbola manana profil etudiant ihany no miseho eto"
                        >
                            {utilisateurs.length === 0 ? (
                                <MenuItem disabled>Aucun utilisateur disponible</MenuItem>
                            ) : (
                                utilisateurs.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.first_name || ""} {u.last_name || ""} ({u.username})
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    </Grid>

                    {/* 2. NUMERO MATRICULE (NAMPIANA) */}
                    <Grid item xs={12}>
                        <TextField
                            label="Numéro Matricule"
                            fullWidth
                            required
                            placeholder="Ohatra: MAT-2026-001"
                            value={matricule}
                            onChange={(e) => setMatricule(e.target.value)}
                        />
                    </Grid>

                    {/* 3. ANNEE D'ENTREE */}
                    <Grid item xs={12}>
                        <TextField
                            label="Année d'entrée"
                            type="number"
                            fullWidth
                            required
                            value={anneeEntree}
                            onChange={(e) => setAnneeEntree(parseInt(e.target.value) || 2026)}
                        />
                    </Grid>

                    {/* Bokotra Action */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            component={Link}
                            to="/architecture-academique"
                            disabled={submitting}
                            sx={{ textTransform: 'none' }}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                            disabled={submitting}
                            sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, textTransform: 'none' }}
                        >
                            {submitting ? "Création..." : "Confirmer le Profil"}
                        </Button>
                    </Grid>

                </Grid>
            </Paper>

            <Snackbar
                open={success}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    Profil étudiant créé avec succès ! Redirection...
                </Alert>
            </Snackbar>
        </Box>
    );
}