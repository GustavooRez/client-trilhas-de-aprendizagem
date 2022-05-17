import React, { useState, useCallback } from "react";
import Container from "@material-ui/core/Container";
import "date-fns";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@mui/material/Alert";
import Link from "@material-ui/core/Link";
const axios = require("axios").default;

export default function InteresseAdministrador() {
  const [inputValues, setInputValues] = useState({
    nome: "",
    email: "",
    justificativa: "",
  });

  var [status, setStatus] = useState(true);
  var [classStatus, setClassStatus] = useState("success");

  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });

  function onSubmit() {
    axios
      .post(`${process.env.REACT_APP_API_URL}/users/interest-administrator`, {
        nome: inputValues.nome,
        email: inputValues.email,
        justificativa: inputValues.justificativa,
      })
      .then((res) => {
        if (res.data.status === 200) {
          setStatus(
            `Aguarde! O seu interesse foi registrado e em breve um adminsitrador te retornará!`
          );
          setClassStatus("success");
        } else {
          setStatus(res.data.error);
          setClassStatus("error");
        }
      });
  }
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className="mt-3 mt-md-5">
          <div className="text-center">
            <div>
              <img
                className="mb-5"
                style={{ width: "15vh" }}
                src={require("../../images/logografo.png")}
                alt="logo"
              />
            </div>
            <Typography component="h1" variant="h4">
              Formulário de interesse
            </Typography>
            {status !== true ? (
              <Alert className="my-2" variant="filled" severity={classStatus}>
                {status}
              </Alert>
            ) : (
              ""
            )}
            <p className="pt-4" style={{ textAlign: "justify" }}>
              Preencha esse formulário com os seus dados e a justificativa do
              porque você quer ser um administrador de trilhas! Um administrador
              entrará em contato com você!
            </p>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Seu nome"
              onChange={handleOnChange}
              name="nome"
            ></TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail de contato"
              name="email"
              onChange={handleOnChange}
            ></TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="justificativa"
              label="Justificativa de uso"
              name="justificativa"
              onChange={handleOnChange}
            ></TextField>
            <Button
              type="button"
              variant="contained"
              fullWidth
              color="primary"
              size="large"
              className="mb-3 mb-md-4 mt-4"
              onClick={() => onSubmit()}
            >
              Enviar
            </Button>

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
