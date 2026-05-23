import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box, Typography, Button, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, 
    CircularProgress, Alert, Chip, Divider
} from '@mui/material';
import { ArrowBack, School } from '@mui/icons-material';
import axiosInstance from '../api/axios';

export default function DetailsFiliere() {
    const { id } = useParams(); // Alaina avy amin'ny URL ny ID-n'ny filière
    
    const [filiere, setFiliere] = useState(null);
    const [mpianatraLisitra, setMpianatraLisitra] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        
        // Alaina miaraka ny Filière, ny Inscriptions, ary ny lisitry ny Mpianatra rehetra
        Promise.all([
            axiosInstance.get(`filieres/${id}/`),
            axiosInstance.get(`inscriptions/`),
            axiosInstance.get(`etudiants/`) // Alaina mba hahazoana ny 'matricule' sy 'user_details'
        ])
            .then(([resFiliere, resInscriptions, resEtudiants]) => {
                setFiliere(resFiliere.data);

                const rehetraInscriptions = resInscriptions.data;
                const rehetraEtudiants = resEtudiants.data;

                // 1. Sivanina fotsiny ny inscription an'ity filière ity
                const InscriptionsVoasivana = Array.isArray(rehetraInscriptions)
                    ? rehetraInscriptions.filter(ins => ins.filiere === parseInt(id))
                    : [];

                // 2. Ampiarahina amin'ny mombamomba ny mpianatra (matricule, anarana) tsirairay
                const lisitraFeno = InscriptionsVoasivana.map(inscription => {
                    // Jerena tsara raha efa manana pitsopitsony sahady ilay etudiant na ID fotsiny
                    const etudiantId = typeof inscription.etudiant === 'object' 
                        ? inscription.etudiant.id 
                        : inscription.etudiant;

                    // Tadiavina ao amin'ny lisitry ny etudiants ilay manana ID mifanentana
                    const profilMpianatra = rehetraEtudiants.find(et => et.id === etudiantId);

                    return {
                        ...inscription,
                        etudiant_feno: profilMpianatra // Ampidirina eto ny mombamomba azy rehetra
                    };
                });

                setMpianatraLisitra(lisitraFeno);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement détails filière:", err);
                setError("Tsy tontosa ny fangalana ny mombamomba ity filière ity.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">Chargement des détails...</Typography>
            </Box>
        );
    }

    if (error || !filiere) {
        return (
            <Box sx={{ mt: 3 }}>
                <Alert severity="error">{error || "Tsy hita io filière io."}</Alert>
                <Button component={Link} to="/architecture-academique" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
                    Retour à la gestion académique
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 2, p: 1 }}>
            {/* Bokotra Hiverenana */}
            <Button
                component={Link}
                to="/admin/architecture-academique"
                startIcon={<ArrowBack />}
                sx={{ mb: 3, color: '#64748b' }}
            >
                Retour aux filières
            </Button>

            {/* Loham-pejy: Mombamomba ny Filière */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f8fafc', boxShadow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <School sx={{ fontSize: 40, color: '#2563eb' }} />
                        <Box>
                            <Typography variant="h4" fontWeight="bold" color="#1e293b">
                                {filiere.nom_filiere || filiere.nom || filiere.code}
                            </Typography>
                            {/* <Typography variant="body2" color="text.secondary">
                                Code de la filière: <strong>{filiere.code_filiere || "Tsy misy"}</strong>
                            </Typography> */}
                        </Box>
                    </Box>
                    <Chip 
                        label={filiere.niveau || "NIVEAU"} 
                        color="primary" 
                        sx={{ fontWeight: 'bold', px: 1, fontSize: '0.9rem' }} 
                    />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body1" color="text.primary">
                    Effectifs des etudiants: <strong>{mpianatraLisitra.length} {mpianatraLisitra.length > 1 ? 'étudiants' : 'étudiant'}</strong>
                </Typography>
            </Paper>

            {/* Lisitry ny Mpianatra voasoratra anarana */}
            <Typography variant="h5" fontWeight="bold" gutterBottom color="#0f172a" sx={{ mb: 2 }}>
                Liste des Étudiants Inscrits
            </Typography>

            {mpianatraLisitra.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Mbola tsy misy mpianatra voasoratra anarana ao anatin'ity filière ity.
                </Alert>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Nom & Prénoms</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Matricule</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Date d'Inscription</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mpianatraLisitra.map((inscription, index) => {
                                // Alaina avy amin'ilay 'etudiant_feno' izay namboarintsika teo ambony ny mombamomba azy
                                const mpianatra = inscription.etudiant_feno;
                                
                                // Famakiana ny anarana sy fanampiny avy amin'ny user_details
                                const firstName = mpianatra?.user_details?.first_name || "";
                                const lastName = mpianatra?.user_details?.last_name || "";
                                const username = mpianatra?.user_details?.username || `Mpianatra n°${inscription.etudiant}`;
                                
                                const anaranaFeno = (firstName || lastName) ? `${firstName} ${lastName}` : username;
                                
                                // Efa miseho tsara ny matricule izao satria efa azo ny profil feno
                                const matricule = mpianatra?.matricule || "Tsy misy";

                                const datyInsc = inscription.date_inscription 
                                    ? new Date(inscription.date_inscription).toLocaleDateString('fr-FR') 
                                    : "-";

                                return (
                                    <TableRow key={inscription.id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 500, color: '#0f172a' }}>
                                            {anaranaFeno}
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={matricule} size="small" variant="outlined" color="primary" />
                                        </TableCell>
                                        <TableCell color="text.secondary">{datyInsc}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}