import React, { use, useState, useEffect } from 'react'; // Nampiana useEffect
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Box, Typography, Paper, Button, TextField, CircularProgress, Alert, LinearProgress } from '@mui/material';
import { ArrowBack, CloudUpload, InsertDriveFile } from '@mui/icons-material';

export default function ImporterFichierExercice() {
    const { exerciceId: rawId } = useParams(); 
    const navigate = useNavigate();

    // Extraction de l'ID numérique pur
    const exerciceId = rawId?.includes('-') ? rawId.split('-').pop() : rawId;

    // États
    const [nomFichier, setNomFichier] = useState('');
    const [fichier, setFichier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [status, setStatus] = useState({ error: null, success: false });
    
    // State vaovao hitazonana ny lohatenin'ny exercice
    const [exerciceTitre, setExerciceTitre] = useState('');
    const [loadingExercice, setLoadingExercice] = useState(true);

    // useEffect hakana ny lohatenin'ny exercice amin'ny API
    useEffect(() => {
        const fetchExerciceDetails = async () => {
            if (!exerciceId) return;
            try {
                setLoadingExercice(true);
                // Antsoina ny API maka ny antsipirian'ilay exercice manokana
                const response = await axiosInstance.get(`/exercices/${exerciceId}/`);
                if (response.data && response.data.titre_exercice) {
                    setExerciceTitre(response.data.titre_exercice);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération de l'exercice:", err);
                // Tsy tiana hanakana ny fampidirana fichier ny fahadisoana eto ka avela fotsiny
            } finally {
                setLoadingExercice(false);
            }
        };

        fetchExerciceDetails();
    }, [exerciceId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFichier(file);
            if (!nomFichier) setNomFichier(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fichier || !exerciceId) return setStatus({ success: false, error: "Fichier ou identifiant manquant." });

        const formData = new FormData();
        formData.append('exercice', exerciceId);
        formData.append('nom_fichier', nomFichier);
        formData.append('fichier', fichier);

        try {
            setLoading(true);
            setStatus({ error: null, success: false });

            await axiosInstance.post('/fichiers-exercices/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
            });

            setStatus({ error: null, success: true });
            setTimeout(() => navigate(-1), 1500);
        } catch (err) {
            const msg = err.response?.data?.detail || "Erreur lors du téléversement.";
            setStatus({ success: false, error: msg });
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Box>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ color: '#64748b', textTransform: 'none', mb: 3 }}>
                Retour
            </Button>

            <Paper elevation={0}>
                
                {/* Fampisehoana ny Lohatenin'ny Exercice */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight="700" color="#0f172a" sx={{ mb: 0.5 }}>
                        Ajouter un document
                    </Typography>
                    {loadingExercice ? (
                        <CircularProgress size={16} sx={{ mt: 1 }} />
                    ) : (
                        exerciceTitre && (
                            <Typography variant="body" color="primary" fontWeight="600">
                                Exercice : {exerciceTitre}
                            </Typography>
                        )
                    )}
                </Box>

                {status.error && <Alert severity="error" sx={{ mb: 2 }}>{status.error}</Alert>}
                {status.success && <Alert severity="success" sx={{ mb: 2 }}>Fichier envoyé avec succès !</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* Input file miafina */}
                    <input
                        type="file"
                        id="file-upload-input"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    <Button
                        component="label"
                        htmlFor="file-upload-input" // Nampifandraisina amin'ilay input file eo ambony
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        sx={{ py: 3, borderStyle: 'dashed', borderWidth: '2px', textTransform: 'none' }}
                    >
                        {fichier ? "Changer le document" : "Sélectionner un fichier"}
                    </Button>

                    {fichier && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <InsertDriveFile color="primary" />
                            <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>{fichier.name}</Typography>
                        </Box>
                    )}

                    {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} color="success" />}

                    <Button type="submit" variant="contained" disabled={loading || !fichier} sx={{ py: 1.2, fontWeight: 'bold', textTransform: 'none', bgcolor: '#2563eb' }}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Enregistrer le support"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}