import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import {
    Typography, Box, CircularProgress, Alert,
    Divider, Chip, Paper, Button, Accordion, AccordionSummary, AccordionDetails,
    List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { School, ArrowBack, Layers, Add, ExpandMore, UploadFile, CloudUpload, InsertDriveFile } from '@mui/icons-material';

export default function DetailsSuiviMatiere() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [matiereInfo, setMatiereInfo] = useState(null);
    const [lesCours, setLesCours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatiereCoursEtFichiers = async () => {
            try {
                setLoading(true);

                // 1. Rehetra miara-mandeha (Simultaneous requests)
                const [matiereResponse, coursResponse, fichiersResponse] = await Promise.all([
                    axiosInstance.get(`/matieres/${id}/`),
                    axiosInstance.get(`/cours/`, { params: { matiere: id } }),
                    axiosInstance.get(`/fichiers-cours/`)
                ]);

                setMatiereInfo(matiereResponse.data);

                // 2. Fitivanana ny cours an'ity matiere ity ihany
                const coursFiltres = Array.isArray(coursResponse.data)
                    ? coursResponse.data.filter(c => String(c.matiere) === String(id))
                    : [];

                // Fakana ny rakitra (files) rehetra avy amin'ny API Django DRF
                const tousLesFichiers = Array.isArray(fichiersResponse.data) ? fichiersResponse.data : [];
                
                // 3. Fampifandraisana ny rakitra amin'ny cours misy azy (cours: 1, cours: 2...)
                const coursAvecLeursFichiers = coursFiltres.map(cours => {
                    return {
                        ...cours,
                        fichiers: tousLesFichiers.filter(f => {
                            const coursIdDuFichier = f.cours && typeof f.cours === 'object' ? f.cours.id : f.cours;
                            return String(coursIdDuFichier) === String(cours.id);
                        })
                    };
                });

                setLesCours(coursAvecLeursFichiers);
                setError(null);

            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
                setError("Impossible de récupérer les détails, les chapitres ou les fichiers associés.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchMatiereCoursEtFichiers();

    }, [id]);

    const handleGoToAjouter = () => {
        navigate(`/enseignant/ajouter-cours`, {
            state: { matiereId: id, matiereTitre: matiereInfo?.titre }
        });
    };

    const handleGoToImporterGlobal = () => {
        navigate(`/enseignant/importer-fichier-syllabus/${id}`, {
            state: { matiereTitre: matiereInfo?.titre }
        });
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Bouton retour */}
            <Box sx={{ mb: 2 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/enseignant/gestion-matieres')}
                    sx={{ color: '#64748b', '&:hover': { color: '#0f172a' }, textTransform: 'none' }}
                >
                    Retour
                </Button>
            </Box>

            {/* Fampisehoana mandritra ny fikarohana (Loading) */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Fampisehoana rehefa misy diso (Error) */}
            {error && !loading && (
                <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto' }}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                </Box>
            )}

            {/* Votoatiny lehibe (Main Content) */}
            {!loading && !error && matiereInfo && (
                <Box sx={{ mx: 'auto' }}>
                    <Paper
                        elevation={0}
                        sx={{ p: 3, width: '100%', borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}
                    >
                        {/* Lohateny momba ny Matiere */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ bgcolor: '#eff6ff', p: 1.5, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <School sx={{ color: '#2563eb', fontSize: '2.5rem' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight="800" color="#0f172a" sx={{ lineHeight: 1.2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                                        {matiereInfo.titre}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 3, mt: 0.5 }}>
                                        <Typography variant='caption' color="text.secondary">
                                            Code : <strong style={{ color: '#1e293b' }}>{matiereInfo.code_matiere}</strong>
                                        </Typography>
                                        <Typography variant='caption' color="text.secondary">
                                            Crédit : <strong style={{ color: '#1e293b' }}>{matiereInfo.credits_ects} ECTS</strong>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.5 }}>
                                <Typography sx={{ fontSize: 14, fontWeight: '700', letterSpacing: 1 }} color="primary" variant='overline'>
                                    {matiereInfo.filiere_details?.nom_filiere || matiereInfo.filiere || 'Non défini'}
                                </Typography>
                                <Chip
                                    icon={<Layers sx={{ fontSize: '0.9rem !important' }} />}
                                    label={matiereInfo.filiere_details?.niveau || matiereInfo.niveau || "Niveau inconnu"}
                                    color="secondary"
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />

                        {/* Faritra fanovana sy fampidirana (Actions Zone) */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                            <Box>
                                <Typography variant="h5" fontWeight="700" color="#1e293b">
                                    Syllabus et supports de cours
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gestion des chapitres et de leurs documents joints ({lesCours.length})
                                </Typography>
                            </Box>
                        </Box>

                        {/* Fampisehoana ireo Cours (Accordions) */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {lesCours.length > 0 ? (
                                lesCours.map((cours, index) => (
                                    <Accordion
                                        key={cours.id}
                                        defaultExpanded={index === 0} // Sokafana ho azy ny voalohany
                                        disableElevation
                                        sx={{ border: '1px solid #e2e8f0', borderRadius: '12px !important', '&:before': { display: 'none' }, overflow: 'hidden' }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' } }}>
                                            <Typography fontWeight="600" color="#1e293b">
                                                {index + 1}. {cours.titre_cours}
                                            </Typography>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ p: 3, bgcolor: '#ffffff' }}>
                                            {/* Famaritana ny toko (Description) */}
                                            <Typography variant="subtitle2" fontWeight="700" color="#475569" sx={{ mb: 1 }}>
                                                Description du chapitre :
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', whiteSpace: 'pre-line', mb: 3 }}>
                                                {cours.contenu || "Aucun détail textuel fourni pour ce chapitre."}
                                            </Typography>

                                            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                                            {/* FARITRA FAMPISEHOANA NY RAKITRA TÉLÉCHARGEABLES */}
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="subtitle2" fontWeight="700" color="#1e293b" sx={{ mb: 1.5 }}>
                                                    Documents téléchargeables :
                                                </Typography>

                                                {cours.fichiers && cours.fichiers.length > 0 ? (
                                                    <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        {cours.fichiers.map((file) => {
                                                            const fileUrl = file.fichier; 
                                                            if (!fileUrl) return null;

                                                            // 1. Diovina ny URL raha misy parmètre d'IHM ary alaina ny extension (.pdf, .odt, .png...)
                                                            const cleanUrl = fileUrl.split('?')[0];
                                                            const physicalFileName = cleanUrl.split('/').pop() || '';
                                                            const extension = physicalFileName.split('.').pop()?.toLowerCase() || '';

                                                            // 2. Diovina ny 'nom_fichier' mba tsy hiverina roa ny extension
                                                            let displayName = file.nom_fichier || physicalFileName;
                                                            if (displayName.toLowerCase().endsWith(`.${extension}`)) {
                                                                displayName = displayName.substring(0, displayName.length - (extension.length + 1));
                                                            }

                                                            // 3. Fanambarana ny anarany madio sy ny extension-ny
                                                            const labelAffichage = extension ? `${displayName}.${extension}` : displayName;

                                                            // 4. Loko isan-karazany arakaraka ny karazan-drakitra (file type color)
                                                            let iconColor = "primary"; // Manga (.odt na hafa)
                                                            if (extension === 'pdf') iconColor = "error"; // Mena ho an'ny PDF
                                                            if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) iconColor = "success"; // Maitso ho an'ny sary
                                                            if (['doc', 'docx', 'odt'].includes(extension)) iconColor = "warning"; // Orange ho an'ny Word/ODT

                                                            return (
                                                                <ListItem 
                                                                    key={file.id}
                                                                    component="a"
                                                                    href={fileUrl} 
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download={physicalFileName}
                                                                    sx={{ 
                                                                        textDecoration: 'none', 
                                                                        bgcolor: '#f8fafc', 
                                                                        borderRadius: '8px', 
                                                                        border: '1px solid #e2e8f0',
                                                                        transition: '0.2s',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        '&:hover': { bgcolor: '#eff6ff', borderColor: '#bfdbfe' }
                                                                    }}
                                                                >
                                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                                        <InsertDriveFile color={iconColor} />
                                                                    </ListItemIcon>
                                                                    <ListItemText 
                                                                        primary={labelAffichage} 
                                                                        primaryTypographyProps={{ variant: 'body2', fontWeight: '600', color: '#1e293b' }}
                                                                        secondary={`Ajouté le : ${new Date(file.date_ajout).toLocaleDateString('fr-FR')} à ${new Date(file.date_ajout).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}`}
                                                                    />
                                                                </ListItem>
                                                            );
                                                        })}
                                                    </List>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', pl: 1 }}>
                                                        Aucun document ou fichier n'a été téléversé pour ce chapitre.
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4, px: 2, border: '2px dashed #e2e8f0', borderRadius: '12px', bgcolor: '#fafafa' }}>
                                    <Typography variant="body1" color="text.secondary" fontWeight="500">
                                        Aucun syllabus n’a encore été ajouté pour cette matière.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>
            )}
        </Box>
    );
}