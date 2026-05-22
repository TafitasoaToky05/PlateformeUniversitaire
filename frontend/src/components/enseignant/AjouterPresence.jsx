import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios'; 

// Importation an'ny singa MUI
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  ButtonGroup, 
  Button, 
  Alert, 
  CircularProgress,
  Chip
} from '@mui/material';

// Importation an'ny Kisary (Icons)
import SaveIcon from '@mui/icons-material/Save';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupOffIcon from '@mui/icons-material/GroupOff';

const AjouterPresence = () => {
  const [matieres, setMatieres] = useState([]);
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [dateCours, setDateCours] = useState(new Date().toISOString().split('T')[0]);
  const [heureDebut, setHeureDebut] = useState('08:00');
  const [enseignantId, setEnseignantId] = useState('1'); 
  
  const [listeMpiandry, setListeMpiandry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Maka ny lisitry ny taranja
  useEffect(() => {
    axiosInstance.get('/matieres/') 
      .then(res => setMatieres(res.data))
      .catch(err => console.error("Error fetching matieres", err));
  }, []);

  // 2. Rehefa mifidy taranja
  const handleMatiereChange = (e) => {
    const matiereId = e.target.value;
    setSelectedMatiere(matiereId);
    setMessage({ type: '', text: '' });
    
    if (matiereId) {
      setLoading(true);
      axiosInstance.get(`/matieres/${matiereId}/`)
        .then(res => {
          const etudiants = res.data.etudiants_inscrits || [];
          const initialLignes = etudiants.map(etudiant => ({
            etudiant_id: etudiant.id,
            matricule: etudiant.matricule,
            nom: etudiant.user_details?.last_name || etudiant.nom || 'Tsy misy anarana', 
            prenom: etudiant.user_details?.first_name || etudiant.prenom || '',
            statut: 'PRESENT', 
            remarque: ''
          }));
          setListeMpiandry(initialLignes);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching students", err);
          setLoading(false);
        });
    } else {
      setListeMpiandry([]);
    }
  };

  const handleStatutChange = (index, newStatut) => {
    const updated = [...listeMpiandry];
    updated[index].statut = newStatut;
    setListeMpiandry(updated);
  };

  const handleRemarqueChange = (index, text) => {
    const updated = [...listeMpiandry];
    updated[index].remarque = text;
    setListeMpiandry(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMatiere) {
      setMessage({ type: 'error', text: 'Misafidiana taranja azafady.' });
      return;
    }

    const payload = {
      matiere: parseInt(selectedMatiere),
      date_cours: dateCours,
      heure_debut: heureDebut ? `${heureDebut}:00` : null,
      enseignant: parseInt(enseignantId),
      lignes: listeMpiandry.map(l => ({
        etudiant_id: l.etudiant_id,
        statut: l.statut,
        remarque: l.remarque
      }))
    };

    try {
      const response = await axiosInstance.post('/presences/', payload);
      setMessage({ type: 'success', text: response.data.message || "Fandraisana anarana voatahiry soa aman-tsara! ✨" });
      setSelectedMatiere('');
      setListeMpiandry([]);
    } catch (error) {
      console.error("Error saving attendance:", error);
      const errorMsg = error.response?.data?.error || error.response?.data || "Nisy olana ny fitahirizana.";
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        
        {/* Loha-pejy (Header) */}
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2, mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}>
            <AssignmentIcon color="primary" fontSize="large" /> Fandraisana Anarana
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Fenoy ny safidy mifanentana amin'ny taranja sy ny fahavononon'ny mpianatra.
          </Typography>
        </Box>

        {/* Fampandrenesana (Alerts) */}
        {message.text && (
          <Alert 
            severity={message.type === 'success' ? 'success' : 'error'} 
            sx={{ mb: 4, borderRadius: 2, fontWeight: 500 }}
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Fizarana Safidy ambony (Formulaire Filters) */}
          <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 3, border: '1px solid', borderColor: 'grey.200', mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="select-matiere-label">Taranja (Matière)</InputLabel>
                  <Select
                    labelId="select-matiere-label"
                    value={selectedMatiere}
                    onChange={handleMatiereChange}
                    label="Taranja (Matière)"
                    sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                  >
                    <MenuItem value=""><em>-- Safidio ny taranja --</em></MenuItem>
                    {matieres.map(m => (
                      <MenuItem key={m.id} value={m.id}>{m.code_matiere} - {m.titre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Daty fandraisana"
                  type="date"
                  fullWidth
                  value={dateCours}
                  onChange={(e) => setDateCours(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Ora hanombohana"
                  type="time"
                  fullWidth
                  value={heureDebut}
                  onChange={(e) => setHeureDebut(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Lisitry ny Mpianatra */}
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
              <CircularProgress size={40} thickness={4} />
              <Typography variant="body2" color="text.secondary">Eo am-pakana ny lisitry ny mpianatra...</Typography>
            </Box>
          ) : listeMpiandry.length > 0 ? (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
              <Table minWidth={650}>
                <TableHead sx={{ bgcolor: 'grey.900' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Matricule</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Anarana & Fanampiny</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', textAlign: 'center' }}>Statut</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Fanamarihana / Remarque</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listeMpiandry.map((ligne, index) => (
                    <TableRow key={ligne.etudiant_id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>
                        <Chip label={ligne.matricule} size="small" variant="outlined" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {ligne.nom} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}>{ligne.prenom}</Box>
                      </TableCell>
                      <TableCell align="center">
                        <ButtonGroup size="small" aria-label="statut buttons" sx={{ p: 0.5, bgcolor: 'grey.100', borderRadius: 2 }}>
                          <Button
                            onClick={() => handleStatutChange(index, 'PRESENT')}
                            variant={ligne.statut === 'PRESENT' ? 'contained' : 'text'}
                            color="success"
                            sx={{ fontWeight: 'bold', px: 2, borderRadius: 1.5 }}
                          >
                            Present
                          </Button>
                          <Button
                            onClick={() => handleStatutChange(index, 'RETARD')}
                            variant={ligne.statut === 'RETARD' ? 'contained' : 'text'}
                            color="warning"
                            sx={{ fontWeight: 'bold', px: 2, borderRadius: 1.5 }}
                          >
                            Retard
                          </Button>
                          <Button
                            onClick={() => handleStatutChange(index, 'ABSENT')}
                            variant={ligne.statut === 'ABSENT' ? 'contained' : 'text'}
                            color="error"
                            sx={{ fontWeight: 'bold', px: 2, borderRadius: 1.5 }}
                          >
                            Absent
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell sx={{ minWidth: 200 }}>
                        <TextField
                          placeholder="Fialan-tsiny..."
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={ligne.remarque}
                          onChange={(e) => handleRemarqueChange(index, e.target.value)}
                          InputProps={{ sx: { borderRadius: 2 } }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Bokotra Fitahirizana ao ambany */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{ borderRadius: 2.5, px: 4, fontWeight: 'bold', textTransform: 'none', boxShadow: 3 }}
                >
                  Tahirizina ny Pejy
                </Button>
              </Box>
            </TableContainer>
          ) : selectedMatiere && (
            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', bgcolor: 'amber.50', borderColor: 'amber.200', borderRadius: 3 }}>
              <GroupOffIcon sx={{ fontSize: 48, color: 'amber.800', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'amber.900' }}>
                Tsy misy mpianatra voasoratra anarana
              </Typography>
              <Typography variant="body2" color="amber.700" sx={{ mt: 0.5 }}>
                Hamarino ny mpianatra voasoratra ao amin'ity taranja ity any amin'ny fitantanana.
              </Typography>
            </Paper>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default AjouterPresence;