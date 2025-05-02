import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";

const RegisterUserDialog = ({ open, onClose, onUserCreated }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
    password: "",
    filial: "",
    levelUser: "1",
    costCenter: "",
  });

  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFiliais, setLoadingFiliais] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchFiliais();
    }
  }, [open]);

  const fetchFiliais = async () => {
    setLoadingFiliais(true);
    setError("");
    try {
      const response = await api.get("/filial");
      setFiliais(response.data);
    } catch (error) {
      console.error("Erro ao buscar filiais:", error);
      setError("Não foi possível carregar a lista de filiais");
    } finally {
      setLoadingFiliais(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users", {
        ...userInfo,
        levelUser: parseInt(userInfo.levelUser),
      });

      onUserCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setError(error.response?.data?.message || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 12,
          border: `2px solid ${green[500]}`,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            backgroundColor: green[500],
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Cadastrar Novo Usuário
        </DialogTitle>

        <DialogContent sx={{ padding: "20px 24px" }}>
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{
                marginBottom: 2,
                padding: "0 10px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {error}
            </Typography>
          )}

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={userInfo.email}
            onChange={handleChange}
            sx={{
              "& .MuiInputLabel-root": { color: green[700] },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: green[500],
                },
              },
            }}
          />

          <TextField
            label="Nome Completo"
            name="name"
            fullWidth
            margin="normal"
            required
            value={userInfo.name}
            onChange={handleChange}
            sx={{
              "& .MuiInputLabel-root": { color: green[700] },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: green[500],
                },
              },
            }}
          />

          <TextField
            label="Senha"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={userInfo.password}
            onChange={handleChange}
            sx={{
              "& .MuiInputLabel-root": { color: green[700] },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: green[500],
                },
              },
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
            required
            sx={{
              "& .MuiInputLabel-root": { color: green[700] },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: green[500],
                },
              },
            }}
          >
            <InputLabel>Filial</InputLabel>
            <Select
              name="filial"
              value={userInfo.filial}
              onChange={handleChange}
              label="Filial"
              disabled={loadingFiliais}
            >
              {loadingFiliais ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                  Carregando filiais...
                </MenuItem>
              ) : filiais.length === 0 ? (
                <MenuItem disabled>Nenhuma filial disponível</MenuItem>
              ) : (
                filiais.map((filial) => (
                  <MenuItem key={filial.id} value={filial.id}>
                    {filial.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Centro de Custo"
            name="costCenter"
            fullWidth
            margin="normal"
            required
            value={userInfo.costCenter}
            onChange={handleChange}
            sx={{
              "& .MuiInputLabel-root": { color: green[700] },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: green[500],
                },
              },
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
            required
            sx={{
              "& .MuiInputLabel-root": { color: green[700] },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: green[500],
                },
              },
            }}
          >
            <InputLabel>Nível de Acesso</InputLabel>
            <Select
              name="levelUser"
              value={userInfo.levelUser}
              onChange={handleChange}
              label="Nível de Acesso"
            >
              <MenuItem value="2">Administrador</MenuItem>
              <MenuItem value="1">Solicitante</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              color: green[500],
              borderColor: green[500],
              "&:hover": {
                backgroundColor: green[50],
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading || loadingFiliais}
            sx={{
              backgroundColor: green[500],
              "&:hover": {
                backgroundColor: green[700],
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Cadastrar"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegisterUserDialog;
