import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import {
    Typography, Box, CircularProgress, Alert, Chip,
    Paper, Button, IconButton, Collapse, Tabs, Tab
} from '@mui/material';
import {
    School, ArrowBack, Add, AssignmentTurnedIn,
    Assignment, CheckCircle, DateRange, Edit,
    Description, ExpandMore, ExpandLess, Delete, InsertDriveFile
} from '@mui/icons-material';

export default function DetailsExamenDevoir() {
    const { id: matiereId } = useParams();
    const navigate = useNavigate();

    const [examens, setExamens] = useState([]);
    const [exercices, setExercices] = useState([]);
    const [matiereInfo, setMatiereInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});

    // State mitazona ny tab misokatra (0 = Examens, 1 = Exercices)
    const [tabValue, setTabValue] = useState(0);

    // useEffect tsotra sy tokana fakana ny data rehetra
    useEffect(() => {
        if (!matiereId) {
            setError("Identifiant de la matière introuvable.");
            loading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Alaina ny mombamomba ny matiere
                const resMatiere = await axiosInstance.get(`/matieres/${matiereId}/`);
                if (resMatiere.data) {
                    setMatiereInfo(resMatiere.data);
                }

                // 2. [NEW] Alaina ny rakitra rehetra ho an'ny examens
                const resFichiersExamens = await axiosInstance.get('/fichiers-examens/');
                const tontoloFichiersExamens = resFichiersExamens.data || [];

                // 3. Alaina ny examens rehetra, sivanina ary ampifandraisina amin'ny rakitra momba azy
                const resExamens = await axiosInstance.get('/examens/');
                const dataExamens = (resExamens.data || [])
                    .filter(item => String(item.matiere) === String(matiereId))
                    .map(item => {
                        // Sivanina ny rakitra mifanaraka amin'ity examen ity
                        const fichiersAssocies = tontoloFichiersExamens.filter(f => String(f.examen) === String(item.id));

                        return {
                            id: `examen-${item.id}`, // Natao miavaka tsara ny id mba tsy hifangaro amin'ny exercice
                            rawId: item.id,
                            titre: item.titre_examen,
                            description: item.description || item.consignes || item.contenu || '',
                            type: 'Examen',
                            fichiers: fichiersAssocies, // Nampiana eto ny lisitry ny rakitra azo
                            date: new Date(item.date_limite).toLocaleDateString('fr-FR', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                        };
                    });
                setExamens(dataExamens);

                // 4. Alaina ny rakitra rehetra ho an'ny exercices
                const resFichiersExercices = await axiosInstance.get('/fichiers-exercices/');
                const tontoloFichiersExercices = resFichiersExercices.data || [];

                // 5. Alaina ny exercices rehetra, sivanina ary ampifandraisina amin'ny rakitra manokana azy
                const resExercices = await axiosInstance.get('/exercices/');
                const dataExercices = (resExercices.data || [])
                    .filter(item => String(item.matiere) === String(matiereId))
                    .map(item => {
                        const fichiersAssocies = tontoloFichiersExercices.filter(f => String(f.exercice) === String(item.id));

                        return {
                            id: `exercice-${item.id}`, // Natao miavaka tsara ihany koa eto
                            rawId: item.id,
                            titre: item.titre_exercice,
                            description: item.description || item.consignes || item.contenu || '',
                            type: 'Exercice',
                            fichiers: fichiersAssocies,
                            date: new Date(item.date_creation).toLocaleDateString('fr-FR')
                        };
                    });
                setExercices(dataExercices);

            } catch (err) {
                console.error("Erreur d'API:", err);
                setError("Impossible de récupérer les détails associés.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [matiereId]);

    const handleToggleCollapse = (id) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Antontan'isa tsotra
    const stats = {
        examens: examens.length,
        exercices: exercices.length,
        total: examens.length + exercices.length
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ width: '100%', mt: 2 }}><Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert></Box>;
    if (!matiereInfo) return null;

    // Fomba fampisehoana ny singa tsirairay (Examen & Exercice)
    const renderItemCard = (item) => {
        const isExpanded = !!expandedItems[item.id];
        return (
            <Paper key={item.id} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', mb: 2 }}>
                <Box
                    onClick={() => handleToggleCollapse(item.id)}
                    sx={{ p: 2, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, bgcolor: isExpanded ? '#f8fafc' : '#ffffff', '&:hover': { bgcolor: '#f8fafc' } }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small">
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight="700" color="#0f172a">{item.titre}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569', bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '6px' }}>
                        <DateRange sx={{ fontSize: '1rem', color: '#64748b' }} />
                        <Typography variant="caption" fontWeight="600">
                            {item.type === 'Examen' ? `Limite : ${item.date}` : `Publié : ${item.date}`}
                        </Typography>
                    </Box>
                </Box>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px dashed #e2e8f0' }}>

                        {/* 1. Fizarana Description */}
                        {item.description ? (
                            <Box sx={{ display: 'flex', gap: 1, bgcolor: '#f8fafc', p: 1.5, borderRadius: '8px' }}>
                                <Description sx={{ fontSize: '1.1rem', color: '#94a3b8', mt: 0.2 }} />
                                <Typography variant="body2" color="#475569" sx={{ whiteSpace: 'pre-line' }}>{item.description}</Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Aucune description.</Typography>
                        )}

                        {/* 2. [UPDATED] Fampisehoana ny rakitra (Fichiers) na Examen na Exercice ilay izy */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                            <Typography variant="caption" fontWeight="700" color="#64748b" textTransform="uppercase">
                                Documents joints ({item.fichiers?.length || 0})
                            </Typography>

                            {item.fichiers && item.fichiers.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {item.fichiers.map((fch) => {
                                        const anaranRakitra = fch.titre_examen || (fch.fichier ? fch.fichier.split('/').pop() : "Document sans nom");

                                        return (
                                            <Box
                                                key={fch.id}
                                                component="a"
                                                href={fch.fichier} 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.2,
                                                    bgcolor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0',
                                                    textDecoration: 'none', color: 'inherit', transition: 'all 0.2s',
                                                    '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' }
                                                }}
                                            >
                                                <InsertDriveFile color="primary" sx={{ fontSize: '1.25rem' }} />
                                                <Typography variant="body2" fontWeight="500" color="#2563eb" noWrap>
                                                    {anaranRakitra}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ) : (
                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    Aucun fichier attaché à cet {item.type?.toLowerCase()}.
                                </Typography>
                            )}
                        </Box>

                        {/* 3. Bokotra Asany (Actions) */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, pt: 1, borderTop: '1px solid #f1f5f9', mt: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'none', fontWeight: '600', borderRadius: '6px',
                                        '&:hover': { bgcolor: '#e0e7ff' }
                                    }}
                                    component={Link}
                                    to={item.type === 'Examen'
                                        ? `/enseignant/importer-fichier-examen/${item.rawId}`
                                        : `/enseignant/importer-fichier-exercice/${item.rawId}`
                                    }
                                >
                                    Importer les fichiers
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button size="small" variant="outlined" startIcon={<Edit />} component={Link} to="#" sx={{ textTransform: 'none', fontWeight: '600', borderRadius: '6px' }}>
                                    Modifier
                                </Button>
                                <Button size="small" variant="contained" startIcon={<Delete />} component={Link} to="#" sx={{ textTransform: 'none', fontWeight: '600', borderRadius: '6px', bgcolor: '#fd0202', '&:hover': { bgcolor: '#eb3508' } }}>
                                    Supprimer
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Collapse>
            </Paper>
        );
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Bouton Retour */}
            <Box>
                <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ color: '#64748b', textTransform: 'none' }}>
                    Retour
                </Button>
            </Box>

            {/* Fiche de la Matière */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ bgcolor: '#eff6ff', p: 1.5, borderRadius: '16px', display: 'flex' }}>
                            <School sx={{ color: '#2563eb', fontSize: '2.5rem' }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="800" color="#0f172a" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                                {matiereInfo.titre}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, mt: 0.5 }}>
                                <Typography variant='caption' color="text.secondary">Code : <strong>{matiereInfo.code_matiere}</strong></Typography>
                                <Typography variant='caption' color="text.secondary">Crédit : <strong>{matiereInfo.credits_ects} ECTS</strong></Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.5 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: '700' }} color="primary" variant='overline'>
                            {matiereInfo.filiere_details?.nom_filiere || matiereInfo.filiere || 'Non défini'}
                        </Typography>
                        <Chip label={matiereInfo.filiere_details?.niveau || matiereInfo.niveau || "Niveau inconnu"} color="secondary" size="small" variant="outlined" sx={{ fontWeight: 'bold', borderRadius: '6px' }} />
                    </Box>
                </Box>
            </Paper>

            {/* Section Évaluations & Listes */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Actions Principales */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="700" color="#1e293b">Évaluations et Exercices</Typography>
                        <Typography variant="body2" color="text.secondary">Gestion des examens, devoirs et exercices ({stats.total})</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" startIcon={<Add />} component={Link} to={`/enseignant/ajouter-exercice/${matiereId}`} color='success' sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            Ajouter Exercice
                        </Button>
                        <Button variant="contained" startIcon={<AssignmentTurnedIn />} component={Link} to={`/enseignant/ajouter-examen/${matiereId}`} sx={{ textTransform: 'none', borderRadius: '8px', bgcolor: '#2563eb' }}>
                            Envoyer Examen
                        </Button>
                    </Box>
                </Box>

                {/* Blocs Statistiques */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {[
                        { count: stats.total, label: "Total Évaluations", icon: <Assignment />, bg: '#eff6ff', border: '#bfdbfe', text: '#1e3a8a', sub: '#1e40af' },
                        { count: stats.examens, label: "Total Examens", icon: <AssignmentTurnedIn />, bg: '#fef3c7', border: '#fde68a', text: '#78350f', sub: '#92400e' },
                        { count: stats.exercices, label: "Total Exercices", icon: <CheckCircle />, bg: '#ecfdf5', border: '#a7f3d0', text: '#064e3b', sub: '#065f46' }
                    ].map((w, idx) => (
                        <Box key={idx} sx={{ flex: 1, minWidth: '200px', p: 2.5, borderRadius: '14px', bgcolor: w.bg, border: `1px solid ${w.border}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                            {React.cloneElement(w.icon, { sx: { color: w.text, fontSize: '2.5rem' } })}
                            <Box>
                                <Typography variant="h5" fontWeight="700" color={w.text}>{w.count}</Typography>
                                <Typography variant="caption" color={w.sub} fontWeight="600">{w.label}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Navigation (Tabs) */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="evaluation tabs" textColor="primary" indicatorColor="primary">
                        <Tab
                            icon={<AssignmentTurnedIn />}
                            iconPosition="start"
                            label={`Examens (${stats.examens})`}
                            sx={{ textTransform: 'none', fontWeight: '700' }}
                        />
                        <Tab
                            icon={<CheckCircle />}
                            iconPosition="start"
                            label={`Exercices (${stats.exercices})`}
                            sx={{ textTransform: 'none', fontWeight: '700' }}
                        />
                    </Tabs>
                </Box>

                {/* CONTENU ISAKY NY TAB */}
                <Box sx={{ mt: 1 }}>
                    {/* Tab 0 : Examens */}
                    {tabValue === 0 && (
                        <Box>
                            {examens.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5, border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                                    <Typography color="text.secondary" variant="body2">Aucun examen planifié.</Typography>
                                </Box>
                            ) : (
                                examens.map(item => renderItemCard(item))
                            )}
                        </Box>
                    )}

                    {/* Tab 1 : Exercices */}
                    {tabValue === 1 && (
                        <Box>
                            {exercices.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5, border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                                    <Typography color="text.secondary" variant="body2">Aucun exercice disponible.</Typography>
                                </Box>
                            ) : (
                                exercices.map(item => renderItemCard(item))
                            )}
                        </Box>
                    )}
                </Box>

            </Paper>
        </Box>
    );
}