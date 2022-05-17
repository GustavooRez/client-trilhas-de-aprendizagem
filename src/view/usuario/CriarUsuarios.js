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
  const [inputValuesProfessor, setInputValuesProfessor] = useState({
    email: ""
  });
  const [userTypeSelect, setUserTypeSelect] = React.useState([]);
  var [status, setStatus] = useState(true);
  var [classStatus, setClassStatus] = useState("success");
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

  const handleOnChangeProfessor = useCallback((event) => {
    const { name, value } = event.target;
    setInputValuesProfessor({ ...inputValuesProfessor, [name]: value });
  });

  const handleSelectUserType = (event) => {
    if (event.value === "professor") {
      document.getElementById("prof_div").style.display = "";
      document.getElementById("admin_div").style.display = "none";
    } else {
      document.getElementById("admin_div").style.display = "";
      document.getElementById("prof_div").style.display = "none";
    }
    setUserTypeSelect(event.value);
  };

  function onSubmit() {
    if (userTypeSelect === "professor") {
      axios
        .post(`${process.env.REACT_APP_API_URL}/users/create-professor`, {
          tipo_usuario: userTypeSelect,
          email: inputValuesProfessor.email
        })
        .then((res) => {
          if (res.data.status === 200) {
            setStatus(
              `O código gerado para a criação do usuário professor foi: ${res.data.codigo}! Também foi enviado o código a este email!`
            );
            setClassStatus("success");
          } else {
            setStatus(res.data.error);
            setClassStatus("error");
          }
        });
    } else if (userTypeSelect === "admin") {
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
        })
        .then((res) => {
          if (res.data.status === 200) {
            return navigate("/");
          } else {
            setStatus(res.data.error);
            setClassStatus("error");
          }
        });
    }
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
              Criar usuario
            </Typography>
            {status !== true ? (
              <Alert className="my-2" variant="filled" severity={classStatus}>
                {status}
              </Alert>
            ) : (
              ""
            )}
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
                { value: "admin", label: "Administrador" },
                { value: "professor", label: "Professor" },
              ]}
              placeholder="Selecione"
              onChange={handleSelectUserType}
            />
            <div id="prof_div" style={{ display: "none" }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-mail do professor"
                name="email"
                onChange={handleOnChangeProfessor}
              ></TextField>
            </div>
            <div id="admin_div" style={{ display: "none" }}>
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
          </div>
        </div>
      </Container>
    </div>
  );
}
