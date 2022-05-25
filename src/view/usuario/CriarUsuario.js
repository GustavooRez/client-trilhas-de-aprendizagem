import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@material-ui/core/Container";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@mui/material/Alert";
import Link from "@material-ui/core/Link";
const axios = require("axios").default;

export default function CriarUsuario() {
  const [inputValues, setInputValues] = useState({
    nome: "",
    aniversario: new Date(),
    telefone: "",
    email: "",
    senha: "",
    codigo: "",
  });
  const [userTypeSelect, setUserTypeSelect] = React.useState([]);
  var [status, setStatus] = useState(true);
  const navigate = useNavigate();

  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setInputValues({ ...inputValues, aniversario: date });
  };

  const handleSelectUserType = (event) => {
    if (event.value === "professor") {
      document.getElementById("codigo_professor_div").style.display = "";
    } else {
      document.getElementById("codigo_professor_div").style.display = "none";
    }
    setUserTypeSelect(event.value);
  };

  function onSubmit() {
    axios
      .post(`${process.env.REACT_APP_API_URL}/users`, {
        nome: inputValues.nome,
        aniversario: inputValues.aniversario
          .toISOString()
          .match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/)[0]
          .split("-")
          .reverse()
          .join("/"),
        telefone: inputValues.telefone,
        email: inputValues.email,
        senha: inputValues.senha,
        tipo_usuario: userTypeSelect,
        codigo: inputValues.codigo
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("accesstoken", res.data.accesstoken);
          localStorage.setItem("userId", res.data.usuario.id);
          localStorage.setItem("username", res.data.usuario.nome);
          localStorage.setItem("usertype", res.data.usuario.tipo_usuario);
          return navigate("/");
        } else {
          setStatus(res.data.error);
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
            <Typography component="h1" variant="h4" className="font-weight-bold">
              Criar usuario
            </Typography>
            {status !== true ? (
              <Alert className="my-2" variant="filled" severity="error">
                {status}
              </Alert>
            ) : (
              ""
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome"
              name="nome"
              onChange={handleOnChange}
            ></TextField>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className="mt-2"
                autoOk
                required
                fullWidth
                variant="inline"
                inputVariant="outlined"
                label="Aniversário"
                format="dd/MM/yyyy"
                InputAdornmentProps={{ position: "end" }}
                value={selectedDate}
                onChange={handleDateChange}
              />
            </MuiPickersUtilsProvider>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="telefone"
              label="Telefone"
              name="telefone"
              onChange={handleOnChange}
            ></TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              type="email"
              onChange={handleOnChange}
            ></TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="senha"
              label="Senha"
              name="senha"
              type="password"
              onChange={handleOnChange}
            ></TextField>
            <InputLabel
              style={{ textAlign: "left" }}
              className={"mt-3"}
              id="label-tipo-usuario"
            >
              Tipo usuário
            </InputLabel>
            <Select
              labelId="label-tipo-usuario"
              options={[
                { value: "student", label: "Estudante" },
                { value: "professor", label: "Professor" },
              ]}
              placeholder="Selecione"
              onChange={handleSelectUserType}
            />
            <div style={{ display: "none" }} id="codigo_professor_div">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="codigo"
                label="Código"
                name="codigo"
                onChange={handleOnChange}
              ></TextField>
            </div>
            <Button
              type="button"
              variant="contained"
              fullWidth
              color="primary"
              size="large"
              className="mb-3 mb-md-4 mt-4"
              onClick={() => onSubmit()}
            >
              Cadastrar
            </Button>
            <Link href="/login">
              <Button
                type="button"
                variant="contained"
                fullWidth
                color="secondary"
                size="large"
                className="mb-3 mb-md-4 mt-2"
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
