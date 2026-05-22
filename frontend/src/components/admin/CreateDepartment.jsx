import * as React from 'react';
import {
  Box, Container, CssBaseline, Typography, TextField, Button,
  Paper, Grid, MenuItem, InputAdornment, Alert
} from '@mui/material';
import {
  CorporateFareOutlined, AbcOutlined, PersonOutlineOutlined,
  BusinessOutlined, SaveOutlined, ArrowBackOutlined
} from '@mui/icons-material';

export default function CreateDepartment() {
  // States ho an'ny fampidirana data (Form states)
  const [nomDep, setNomDep] = React.useState('');
  const [codeDep, setCodeDep] = React.useState('');
  const [chefDep, setChefDep] = React.useState('');
  const [localisation, setLocalisation] = React.useState('');
  const [description, setDescription] = React.useState('');

  // Gestion des messages et chargement
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Simulation de la liste des professeurs éligibles comme Chef de Département
  const listaEnseignants = [
    { id: '1', nom: 'Pr. Rakoto' },
    { id: '2', nom: 'Pr. Rabe' },
    { id: '3', nom: 'Dr. Fenitra' },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Fanamarinana tsotra
    if (!nomDep || !codeDep || !chefDep) {
      setError('Azafady, fenoy avokoa ireo saha manan-danja voatondro (obligatoire).');
      return;
    }

    setLoading(true);

    // Simulation fitehirizana mivantana any amin'ny database
    setTimeout(() => {
      setSuccess('Voaforona soa aman-tsara ny département vaovao!');
      setLoading(false);
      
      // Fafana ny teo aloha rehefa mahomby
      setNomDep('');
      setCodeDep('');
      setChefDep('');
      setLocalisation('');
      setDescription('');
    }, 1500);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="md">
        <CssBaseline />
        
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: '#ffffff'
          }}
        >
          {/* Loha-pejy (Header) */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', borderBottom: '1px solid #e2e8f0', pb: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  bgcolor: '#1e3a8a',
                  color: 'white',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                }}
              >
                <CorporateFareOutlined fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#1e3a8a">
                  Créer un Département
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fampidirana sampam-pampianarana na departemanta lehibe vaovao.
                </Typography>
              </Box>
            </Box>

            {/* Bokotra miverina */}
            <Button
              variant="text"
              startIcon={<ArrowBackOutlined />}
              sx={{ textTransform: 'none', color: 'text.secondary', '&:hover': { color: '#1e3a8a' } }}
            >
              Retour
            </Button>
          </Box>

          {/* Messages Alert */}
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }}>{success}</Alert>}

          {/* Formulaire */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              
              {/* Nom du Département */}
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  id="nomDep"
                  label="Nom du Département"
                  placeholder="Ohatra: Électronique et Informatique"
                  value={nomDep}
                  onChange={(e) => setNomDep(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Code du Département */}
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="codeDep"
                  label="Code / Sigle"
                  placeholder="Ohatra: DEP-EI"
                  value={codeDep}
                  onChange={(e) => setCodeDep(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AbcOutlined />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Chef de Département */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  required
                  fullWidth
                  label="Chef de Département (HOD)"
                  value={chefDep}
                  onChange={(e) => setChefDep(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {listaEnseignants.map((ens) => (
                    <MenuItem key={ens.id} value={ens.id}>
                      {ens.nom}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Localisation / Bâtiment */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="localisation"
                  label="Localisation / Bâtiment"
                  placeholder="Ohatra: Bâtiment Babel, Bloc B"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Description du Département */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  label="Description et Présentation du département"
                  multiline
                  rows={4}
                  placeholder="Soraty eto ny mombamomba fohy ny departemanta..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            {/* Bokotra Action */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, borderTop: '1px solid #e2e8f0', pt: 3 }}>
              <Button
                variant="outlined"
                color="inherit"
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<SaveOutlined />}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#2563eb',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  px: 4,
                  '&:hover': { bgcolor: '#1d4ed8' },
                  boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)'
                }}
              >
                {loading ? 'Y mamorona...' : 'Créer le département'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}