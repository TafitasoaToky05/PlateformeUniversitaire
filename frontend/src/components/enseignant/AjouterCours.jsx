import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { 
    Box, TextField, Button, Paper, 
    Alert, CircularProgress, Autocomplete, Typography 
} from '@mui/material';

// Fanafarana mivantana tsirairay mba hisorohana ny olana ao amin'ny Vite
import Save from '@mui/icons-material/Save';
import ArrowBack from '@mui/icons-material/ArrowBack';

export default function AjouterCours() {
    const location = useLocation();
    const navigate = useNavigate();

    // Alaina avy amin'ny state nalefan'ny DetailsMatiere ny ID sy ny Anarany
    const { matiereId: stateMatiereId, matiereTitre } = location.state || {};

    // States ho an'ny lisitry ny taranja rehetra
    const [listeMatieres, setListeMatieres] = useState([]);
    const [loadingMatieres, setLoadingMatieres] = useState(false);

    // Ny taranja voafidy (Object) sy ny soratra miseho ao amin'ny vata fikarohana (String)
    const [selectedMatiere, setSelectedMatiere] = useState(null);
    const [inputMatiereValue, setInputMatiereValue] = useState('');

    // Ny piantsorohana ny vata fampidirana hafa
    const [titreCours, setTitreCours] = useState('');
    const [contenu, setContenu] = useState('');
    
    // Ny piantsorohana ny fandefasana (Status States)
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // 1. Alaina ny taranja rehetra avy amin'ny API rehefa mavesatra ny pejy
    useEffect(() => {
        const fetchAllMatieres = async () => {
            // Raha toa ka efa misy stateMatiereId dia tsy mila maka ny lisitra rehetra intsony ny API
            if (stateMatiereId) {
                setSelectedMatiere({ id: stateMatiereId, titre: matiereTitre || "Taranja Voafidy" });
                return;
            }

            try {
                setLoadingMatieres(true);
                const response = await axiosInstance.get('/matieres/');
                const data = Array.isArray(response.data) ? response.data : response.data.results || [];
                setListeMatieres(data);
            } catch (err) {
                console.error("Tsy nahazo ny lisitry ny taranja", err);
            } finally {
                setLoadingMatieres(false);
            }
        };

        fetchAllMatieres();
    }, [stateMatiereId, matiereTitre]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Fanamarinana raha toa ka misy taranja voafidy
        if (!selectedMatiere || !selectedMatiere.id) {
            setErrorMsg("Misafidiana taranja iray azafady hiantohana ity lesona ity.");
            return;
        }

        // Fanamarinana tsotra raha feno ny vata
        if (!titreCours.trim() || !contenu.trim()) {
            setErrorMsg("Fenoy tsara ny lohateny sy ny votoatin'ny lesona azafady.");
            return;
        }

        try {
            setSubmitting(true);
            setErrorMsg('');
            setSuccessMsg('');

            const dataToPost = {
                matiere: selectedMatiere.id, // Alaina ny ID avy amin'ilay taranja voafidy
                titre_cours: titreCours,
                contenu: contenu
            };

            await axiosInstance.post('/cours/', dataToPost);

            setSuccessMsg("Tafiditra soa aman-tsara ilay lesona vaovao!");
            
            setTitreCours('');
            setContenu('');
            
            if (!stateMatiereId) {
                setSelectedMatiere(null);
                setInputMatiereValue('');
            }

            // Miverina any amin'ny pejy antsipiriany rehefa afaka 1.5 segondra
            setTimeout(() => {
                navigate(-1);
            }, 1500);

        } catch (err) {
            console.error("Erreur lors de l'ajout du cours", err);
            setErrorMsg(err.response?.data?.detail || "Nisy olana tamina fandefasana ny lesona. Avereno azafady.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Bokotra Miverina */}
            <Box sx={{ width: '100%', maxWidth: '600px', mb: 2 }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate(-1)}
                    sx={{ color: '#64748b', '&:hover': { color: '#0f172a' } }}
                >
                    Hiverina
                </Button>
            </Box>

            <Paper 
                elevation={0} 
                sx={{ 
                    p: { xs: 3, md: 4 }, 
                    width: '100%', 
                    maxWidth: '600px', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff'
                }}
            >
                {/* Valiny rehefa misy diso na fahombiazana */}
                {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{errorMsg}</Alert>}
                {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{successMsg}</Alert>}

                {/* NY FORMULAIRE */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    
                    {/* RAHA EFA AVY ANY AMIN'NY DETAILS MATIERE DIA ASEHO REFA TSOTRA */}
                    {stateMatiereId ? (
                        <Box sx={{ 
                            mb: 3, 
                            p: 2, 
                            bgcolor: '#f1f5f9', 
                            borderRadius: '8px', 
                            border: '1px solid #cbd5e1' 
                        }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                TARANJA (MATIÈRE) AUTOMATIQUE:
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: '600' }}>
                                {selectedMatiere?.titre || "Matière sélectionnée"}
                            </Typography>
                        </Box>
                    ) : (
                        /* AUTOCOMPLETE IHANY RAHA TSY NISY STATE NALEFA (NIDITRA MIVANTANA) */
                        <Autocomplete
                            id="select-matiere-autocomplete"
                            options={listeMatieres}
                            loading={loadingMatieres}
                            
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') return option;
                                return option?.titre ? `${option.titre} ${option.code_matiere ? `(${option.code_matiere})` : ''}` : '';
                            }}
                            
                            isOptionEqualToValue={(option, value) => {
                                if (!value) return false;
                                return String(option.id) === String(value.id);
                            }}
                            
                            value={selectedMatiere}
                            onChange={(event, newValue) => {
                                setSelectedMatiere(newValue);
                            }}
                            inputValue={inputMatiereValue}
                            onInputChange={(event, newInputValue) => {
                                setInputMatiereValue(newInputValue);
                            }}
                            
                            disabled={submitting}
                            renderInput={(params) => {
                                const { InputProps = {}, ...restParams } = params;
                                return (
                                    <TextField
                                        {...restParams}
                                        label="Tadiavo ny Taranja (Matière)"
                                        required
                                        variant="outlined"
                                        margin="normal"
                                        helperText="Manoratra anarana taranja raha hifidy hafa"
                                        InputProps={{
                                            ...InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loadingMatieres ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                );
                            }}
                            sx={{ mb: 1 }}
                        />
                    )}

                    {/* Vata fampidirana ny Lohateny */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="titre_cours"
                        label="Lohatenin'ny Syllabus (Titre du cours)"
                        name="titre_cours"
                        autoFocus={!stateMatiereId}
                        value={titreCours}
                        onChange={(e) => setTitreCours(e.target.value)}
                        disabled={submitting}
                        sx={{ mb: 2 }}
                    />

                    {/* Vata fampidirana ny Votoatiny */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="contenu"
                        label="Votoatin'ny lesona (Contenu)"
                        name="contenu"
                        multiline
                        rows={6}
                        value={contenu}
                        onChange={(e) => setContenu(e.target.value)}
                        disabled={submitting}
                        sx={{ mb: 3 }}
                    />

                    {/* Bokotra handefasana */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        sx={{ 
                            py: 1.5, 
                            borderRadius: '8px', 
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                            bgcolor: '#2563eb',
                            '&:hover': { bgcolor: '#1d4ed8' }
                        }}
                    >
                        {submitting ? 'Mandefa azy...' : 'Tehirizina'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}