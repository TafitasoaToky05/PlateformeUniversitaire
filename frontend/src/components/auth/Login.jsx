import * as React from 'react';
import {
  Box, Container, CssBaseline, Typography, TextField, Button,
  InputAdornment, IconButton, Paper, Link, Alert, Checkbox, FormControlLabel
} from '@mui/material';
import {
  Visibility, VisibilityOff, LockOutlined, EmailOutlined, SchoolOutlined
} from '@mui/icons-material';

// 1. Fanitsiana ny lalan'ny import (relative path ao anaty folder auth/)
import { useAuth } from './AuthContext'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Gestion des erreurs et chargement
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Azafady, fenoy daholo ny saha rehetra.');
      return;
    }

    setLoading(true);

    // Antsoina ilay fonction avy ao amin'ny AuthContext
    const result = await loginUser(email, password);

    if (result.success) {
      // 2. Rehefa tafiditra, dia alefa any amin'ny dashboard-ny mivantana miankina amin'ny role avy any amin'ny Django
      const userRole = result.user?.role; 
      if (userRole === 'admin') {
        navigate('/dashboard-admin');
      } else if (userRole === 'enseignant') {
        navigate('/enseignant-dashboard');
      } else if (userRole === 'etudiant') {
        navigate('/dashboard');
      }  else {
        navigate('/login');
      }
    } else {
      // Fampisehoana ny fahadisoana (ohatra: "Identifiants invalides")
      setError(result.message || 'Nisy olana nitranga tamin\'ny fidirana.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
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
          {/* Logo / Icone de l'Université */}
          <Box
            sx={{
              m: 1,
              bgcolor: '#1e3a8a',
              color: 'white',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              borderRadius: '50%',
              boxShadow: '0px 4px 10px rgba(30, 58, 138, 0.3)'
            }}
          >
            <SchoolOutlined fontSize="large" />
          </Box>

          <Typography component="h1" variant="h5" fontWeight="bold" color="#1e3a8a" sx={{ mt: 1, mb: 1 }}>
            Portail Universitaire
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Entrer votre email et mot de passe.
          </Typography>

          {/* Fampitandremana raha misy diso (Alert Error) */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 1.5 }}>
              {error}
            </Alert>
          )}

          {/* Formulaire */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            {/* Input Email */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse Email"
              name="email"
              autoComplete="email"
              autoFocus
              size="medium"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Input Mot de passe */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              size="medium"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {/* Se souvenir de moi & Mot de passe oublié */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" sx={{ borderRadius: 1 }} disabled={loading} />}
                label={<Typography variant="body2">Souviens-moi</Typography>}
              />
              <Link 
                component="button"
                type="button"
                variant="body2" 
                onClick={() => navigate('/forgot-password')}
                sx={{ color: '#2563eb', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>

            {/* Bokotra Fidirana */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
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
              {loading ? 'Eo am-pifandraisana...' : 'Se connecter'}
            </Button>

            {/* Rohy mankany amin'ny fisoratana anarana (Register) */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Vous n'avez pas une compte? {' '}
                <Link 
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  S'inscrire
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}