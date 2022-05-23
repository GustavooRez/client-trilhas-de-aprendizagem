import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@mui/material/Alert";
import Link from "@material-ui/core/Link";
const axios = require("axios").default;

function Login() {
  var [authStatus, setAuthStatus] = useState(null);
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });

  function onSubmit() {
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        email: inputValues.email,
        senha: inputValues.password,
      })
      .then((res) => {
        if (res.data.accesstoken) {
          localStorage.setItem("accesstoken", res.data.accesstoken);
          localStorage.setItem("userId", res.data.usuario.id);
          localStorage.setItem("username", res.data.usuario.nome);
          localStorage.setItem("usertype", res.data.usuario.tipo_usuario);
          setAuthStatus(true);
          return navigate("/");
        } else {
          setAuthStatus(false);
        }
      });
  }
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className="mt-3 mt-md-5">
          <div className="text-center">
            
            <div>
              <img className="mb-5" style={{width:"15vh"}} src={require('../../images/logografo.png')} alt='logo' />
            </div>
            {authStatus === false ? (
              <Alert className="mb-2" variant="filled" severity="error">
                Email e Senha não encontrados no sistema
              </Alert>
            ) : (
              ""
            )}
            {authStatus === true ? (
              <Alert className="mb-2"  variant="filled" severity="success">
                Autenticação completa
              </Alert>
            ) : (
              ""
            )}
            <Typography
              className="font-weight-bold"
              component="h1"
              variant="h6"
            ></Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              onChange={handleOnChange}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  onSubmit()
                }
              }}
            ></TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Senha"
              name="password"
              type="password"
              onChange={handleOnChange}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  onSubmit()
                }
              }}
            ></TextField>
            <Button
              style={{backgroundColor: "#FFC701"}}
              type="button"
              variant="contained"
              fullWidth
              color="secondary"
              size="large"
              className="mb-3 mb-md-4 mt-4"
              onClick={() => onSubmit()}
            >
              Entrar
            </Button>
            <Link href="/criar-usuario">
              <Button
                type="button"
                variant="contained"
                fullWidth
                color="primary"
                size="large"
                className="mb-3 mb-md-4 mt-4"
              >
                Cadastrar
              </Button>
            </Link>
            
            <Link href="/interesse">Possui interesse em ser Adminsitrador de trilhas?</Link>

            <Link href="/">
              <Button
                type="button"
                variant="contained"
                fullWidth
                color="secondary"
                size="large"
                className="mb-3 mb-md-4 mt-5"
              >
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Login;
