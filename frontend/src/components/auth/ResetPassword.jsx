import * as React from 'react';
import {
  Box, Container, CssBaseline, Typography, TextField, Button,
  InputAdornment, IconButton, Paper, Link, Alert
} from '@mui/material';
import {
  Visibility, VisibilityOff, LockOutlined, LockResetOutlined, ArrowBackOutlined
} from '@mui/icons-material';

export default function ResetPassword() {
  // States ho an'ny fampidirana teny miafina vaovao
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  
  // States ho an'ny fampisehoana na fanafenana ny teny miafina
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  // Gestion des erreurs et succès
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  
  // Rehefa kentsika ny bokotra "Réinitialiser"
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    // Fanamarinana (Validation de base)
    if (!password || !confirmPassword) {
      setError('Azafady, fenoy ny saha rehetra.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Tsy mitovy ny teny miafina roa nampidirinao.');
      return;
    }

    if (password.length < 6) {
      setError('Ny teny miafina vaovao dia tokony hisy litera na isa 6 raha kely indrindra.');
      return;
    }

    setLoading(true);

    // Simulation de mise à jour du mot de passe (API call)
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
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
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            bgcolor: '#ffffff'
          }}
        >
          {/* Icone Reset */}
          <Box
            sx={{
              m: 1,
              bgcolor: '#1e3a8a',
              color: 'white',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              boxShadow: '0px 4px 10px rgba(30, 58, 138, 0.3)'
            }}
          >
            <LockResetOutlined fontSize="large" />
          </Box>

          {!success ? (
            <>
              <Typography component="h1" variant="h5" fontWeight="bold" color="#1e3a8a" sx={{ mt: 1, mb: 1 }}>
                Nouveau mot de passe
              </Typography>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Ampidiro ny teny miafina vaovao hovonjena amin'ny kaontinao.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 1.5 }}>
                  {error}
                </Alert>
              )}

              {/* Formulaire */}
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                {/* Input Nouveau Mot de passe */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Teny miafina vaovao"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Confirm Input Nouveau Mot de passe */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Hamarino ny teny miafina vaovao"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Bokotra fanovana */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 3,
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor: '#2563eb',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  {loading ? 'Y manova teny miafina...' : 'Réinitialiser le mot de passe'}
                </Button>
              </Box>
            </>
          ) : (
            /* Rehefa vita soa aman-tsara ny fanovana (Success State) */
            <Box sx={{ textAlign: 'center', width: '100%', my: 2 }}>
              <Typography component="h1" variant="h5" fontWeight="bold" color="#1e3a8a" sx={{ mt: 1, mb: 1 }}>
                Mot de passe modifié !
              </Typography>
              
              <Alert severity="success" sx={{ width: '100%', my: 3, borderRadius: 1.5, textAlign: 'left' }}>
                Voasolo soa aman-tsara ny teny miafinao. Afaka mampiasa ilay teny miafina vaovao ianao izao rehefa hiditra.
              </Alert>

              <Button
                fullWidth
                variant="contained"
                href="#" // Soloy rohy mankany amin'ny pejy Login-nao eto
                sx={{
                  mb: 2,
                  py: 1.2,
                  borderRadius: 2,
                  bgcolor: '#2563eb',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#1d4ed8' },
                  boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)'
                }}
              >
                Se connecter
              </Button>
            </Box>
          )}

          {/* Rohy miverina raha mbola tsy nampihatra fahombiazana */}
          {!success && (
            <Box sx={{ mt: 1 }}>
              <Link 
                href="#" 
                sx={{ 
                  color: '#1e3a8a', 
                  fontWeight: 'medium', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                <ArrowBackOutlined fontSize="small" /> Retour à la connexion
              </Link>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}