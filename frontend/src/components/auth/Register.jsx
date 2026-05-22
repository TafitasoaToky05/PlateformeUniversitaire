import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  CssBaseline,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  Link,
  Alert,
  MenuItem,
  CircularProgress
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  SchoolOutlined,
  Person,
  BadgeOutlined,
  HowToReg
} from '@mui/icons-material';

export default function Register() {

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'etudiant'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg('');
    setSuccessMsg('');

    if (
      !formData.username ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setErrorMsg('Veuillez remplir tous les champs.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      await axiosInstance.post('/register/', payload);

      setSuccessMsg('Compte créé avec succès !');

      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        role: 'etudiant'
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      console.error(error);

      if (error.response?.data) {
        const data = error.response.data;

        const firstError = Object.values(data)[0];

        setErrorMsg(
          Array.isArray(firstError)
            ? firstError[0]
            : 'Erreur lors de la création du compte.'
        );
      } else {
        setErrorMsg('Erreur serveur.');
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
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
      <Container component="main" maxWidth="sm">
        <CssBaseline />

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: '#ffffff'
          }}
        >

          {/* HEADER */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >

            <Box
              sx={{
                bgcolor: '#1e3a8a',
                color: 'white',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                boxShadow: '0px 4px 10px rgba(30, 58, 138, 0.3)',
                mb: 2
              }}
            >
              <SchoolOutlined fontSize="large" />
            </Box>

            <Typography
              variant="h5"
              fontWeight="bold"
              color="#1e3a8a"
              sx={{ mb: 1 }}
            >
              Portail Universitaire
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              Créez un nouveau compte pour accéder à la plateforme universitaire.
            </Typography>
          </Box>

          {/* ALERT ERROR */}
          {errorMsg && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2
              }}
            >
              {errorMsg}
            </Alert>
          )}

          {/* ALERT SUCCESS */}
          {successMsg && (
            <Alert
              severity="success"
              sx={{
                mb: 2,
                borderRadius: 2
              }}
            >
              {successMsg}
            </Alert>
          )}

          {/* FORM */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%' }}
          >

            {/* USERNAME */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              disabled={loading}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlined color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* PRENOM + NOM */}
            <Box sx={{ display: 'flex', gap: 2 }}>

              <TextField
                margin="normal"
                required
                fullWidth
                label="Prénom"
                name="first_name"
                value={formData.first_name}
                disabled={loading}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Nom"
                name="last_name"
                value={formData.last_name}
                disabled={loading}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

            </Box>

            {/* EMAIL */}
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              label="Adresse Email"
              name="email"
              value={formData.email}
              disabled={loading}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* ROLE */}
            <TextField
              select
              margin="normal"
              required
              fullWidth
              label="Rôle"
              name="role"
              value={formData.role}
              disabled={loading}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HowToReg color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            >
              <MenuItem value="etudiant">
                Étudiant
              </MenuItem>

              <MenuItem value="enseignant">
                Enseignant
              </MenuItem>
            </TextField>

            {/* PASSWORD */}
            <TextField
              margin="normal"
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Mot de passe"
              name="password"
              value={formData.password}
              disabled={loading}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* CONFIRM PASSWORD */}
            <TextField
              margin="normal"
              required
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmer le mot de passe"
              name="confirm_password"
              value={formData.confirm_password}
              disabled={loading}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* BUTTON */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.2,
                borderRadius: 2,
                bgcolor: '#2563eb',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#1d4ed8'
                },
                boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "S'inscrire"
              )}
            </Button>

            {/* LOGIN LINK */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Déjà un compte ?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#2563eb',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Se connecter
                </Link>
              </Typography>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
}