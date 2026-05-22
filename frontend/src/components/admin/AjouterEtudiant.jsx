import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, MenuItem,
    Paper, Grid, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { ArrowBack, Link as LinkIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function AjouterEtudiant() {
    const navigate = useNavigate();

    // ID-n'ny mpianatra (id ao amin'ny model Etudiant) sy filière voafidy eo amin'ny formulaire
    const [etudiantId, setEtudiantId] = useState('');
    const [filiereId, setFiliereId] = useState('');

    // Tahiry ho an'ny lisitra avy amin'ny API
    const [etudiants, setEtudiants] = useState([]);
    const [filieres, setFilieres] = useState([]);

    // States hitantanana ny loading sy ny fahadisoana
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Alaina miaraka ny mpianatra sy ny filières rehefa misokatra ny pejy
    useEffect(() => {
        Promise.all([
            axiosInstance.get("etudiants/"),
            axiosInstance.get("filieres/")
        ])
            .then(([resEtudiants, resFilieres]) => {
                setEtudiants(resEtudiants.data);
                setFilieres(resFilieres.data);
                setLoadingData(false);
            })
            .catch(err => {
                console.error("Erreur chargement data:", err);
                setError("Tsy tontosa ny fangalana ny lisitry ny mpianatra na ny filières.");
                setLoadingData(false);
            });
    }, []);

    // Fandefasana ny fifandraisana (Inscription) any amin'ny API
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!etudiantId || !filiereId) {
            setError("Aza fenoina foana ny saha rehetra.");
            return;
        }

        setSubmitting(true);
        setError(null);

        // Data alefa mifanaraka tsara amin'ny Serializer
        const dataInscription = {
            etudiant: parseInt(etudiantId), // ID ao amin'ny model Etudiant
            filiere: parseInt(filiereId)     // ID ao amin'ny model Filiere
        };

        axiosInstance.post("inscriptions/", dataInscription)
            .then(res => {
                setSubmitting(false);
                setSuccess(true);

                setEtudiantId('');
                setFiliereId('');

                setTimeout(() => {
                    navigate('/admin/architecture-academique');
                }, 2000);
            })
            .catch(err => {
                console.error("Erreur affectation:", err);

                // Fitantanana ny hafatra fahadisoana avy amin'ny UniqueTogetherValidator
                let hafatraFahadisoana = "Nisy olana teo am-pampiarahana ilay mpianatra tamin'ity filière ity.";

                if (err.response && err.response.data) {
                    const data = err.response.data;
                    if (data.non_field_errors) {
                        hafatraFahadisoana = data.non_field_errors[0];
                    } else if (data.etudiant) {
                        hafatraFahadisoana = `Mpianatra: ${data.etudiant[0]}`;
                    } else if (data.filiere) {
                        hafatraFahadisoana = `Filière: ${data.filiere[0]}`;
                    } else if (typeof data === 'string') {
                        hafatraFahadisoana = data;
                    }
                }

                setError(hafatraFahadisoana);
                setSubmitting(false);
            });
    };

    if (loadingData) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">Chargement des données en cours...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
            <Button
                component={Link}
                to="/admin/architecture-academique"
                startIcon={<ArrowBack />}
                sx={{ mb: 3, color: '#64748b' }}
            >
                Retour aux filières
            </Button>

            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">
                Affecter un Étudiant à une Filière
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Sélectionnez un étudiant existant et associez-le à une filière ou une promotion déjà configurée.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3, wordBreak: 'break-word' }}>
                    {error}
                </Alert>
            )}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
                <Grid container spacing={4}>
                    {/* 1. SELECTION DE L'ETUDIANT */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Sélectionner l'Étudiant"
                            fullWidth
                            required
                            value={etudiantId}
                            onChange={(e) => setEtudiantId(e.target.value)}
                            helperText="Choisissez le profil de l'étudiant à inscrire"
                        >
                            {etudiants.length === 0 ? (
                                <MenuItem disabled>Aucun étudiant disponible</MenuItem>
                            ) : (
                                etudiants.map((etudiant) => {
                                    const idMpianatra = etudiant.id;

                                    // Alaina avy ao anatin'ny user_details ny mombamomba azy
                                    const firstName = etudiant.user_details?.first_name || "";
                                    const lastName = etudiant.user_details?.last_name || "";
                                    const username = etudiant.user_details?.username || "Inconnu";
                                    const matricule = etudiant.matricule ? `(${etudiant.matricule})` : "";

                                    // Fanambatranana ny anarana mba hadio ny fampisehoana azy
                                    const anaranaFeno = (firstName || lastName)
                                        ? `${firstName} ${lastName}`
                                        : username;

                                    return (
                                        <MenuItem key={etudiant.id} value={idMpianatra}>
                                            {anaranaFeno} {matricule}
                                        </MenuItem>
                                    );
                                })
                            )}
                        </TextField>
                    </Grid>

                    {/* 2. SELECTION DE LA FILIERE */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Sélectionner la Filière Cible"
                            fullWidth
                            required
                            value={filiereId}
                            onChange={(e) => setFiliereId(e.target.value)}
                            helperText="Choisissez la promotion à laquelle l'affecter"
                        >
                            {filieres.length === 0 ? (
                                <MenuItem disabled>Aucune filière disponible</MenuItem>
                            ) : (
                                filieres.map((filiere) => (
                                    <MenuItem key={filiere.id} value={filiere.id}>
                                        <strong>{filiere.nom_filiere || filiere.code || "CODE"}</strong> &nbsp;-&nbsp; {filiere.niveau}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    </Grid>

                    {/* Bokotra Action */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            component={Link}
                            to="/architecture-academique"
                            disabled={submitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <LinkIcon />}
                            disabled={submitting}
                            sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
                        >
                            {submitting ? "Affectation en cours..." : "Confirmer l'Affectation"}
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
                    Création de l'inscription réussie ! Redirection...
                </Alert>
            </Snackbar>
        </Box>
    );
}