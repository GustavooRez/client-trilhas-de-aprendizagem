import React, { useState, useCallback } from "react";
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

export default function EditarUsuario() {
  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("usertype");
  const [user, setUser] = React.useState(false);
  const [inputValues, setInputValues] = useState({
    nome: "",
    aniversario: new Date(),
    telefone: "",
    email: "",
    senha: ""
  });
  const [trilhas, setTrilha] = React.useState([]);
  const [trilhasUser, setTrilhaUser] = React.useState([]);
  var [classStatus, setClassStatus] = useState("");
  const [trilhaSelected, setTrilhaSelected] = React.useState([]);
  var [status, setStatus] = useState(true);

  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/trails`).then((datas) => {
      datas.data.forEach((data) => {
        trilhas.push({
          value: data.id,
          label: data.titulo,
        });
      });
      setTrilha(trilhas);
    });
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((resUser) => {
        resUser.data.aniversario = new Date(resUser.data.aniversario);
        resUser.data.newTrilha.forEach((trilha) => {
          trilhasUser.push({
            value: trilha.id,
            label: trilha.titulo,
          });
        });
        setTrilhaSelected(trilhasUser)
        setTrilhaUser(trilhasUser);
        setInputValues({
          nome: resUser.data.usuario.nome,
          aniversario: new Date(resUser.data.usuario.aniversario),
          telefone: resUser.data.usuario.telefone,
          email: resUser.data.usuario.email,
        });
        setUser(true);
      });
  }, []);

  const handleChangeTrilha = (event) => {
    let trilhasUser = [];
    event.forEach((evento) => {
      trilhasUser.push(evento.value);
    });

    setTrilhaSelected(trilhasUser);
  };
  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setInputValues({ ...inputValues, aniversario: date });
  };

  function onSubmit() {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          nome: inputValues.nome,
          aniversario: inputValues.aniversario
            .toISOString()
            .match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/)[0]
            .split("-")
            .reverse()
            .join("/"),
          telefone: inputValues.telefone,
          email: inputValues.email,
          tipo_usuario: userType,
          trilhas: trilhaSelected,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === 200) {
          setStatus(res.data.message);
          setClassStatus("success");
          setTimeout(() => {
            setStatus(true);
          }, 5000);
        } else {
          setStatus(res.data.error);
          setClassStatus("error");
          setTimeout(() => {
            setStatus(true);
          }, 5000);
        }
      });
  }
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className="mt-3 mt-md-5">
          <div className="text-center">
            <Typography component="h1" variant="h4">
              Editar usuario
            </Typography>
            {status !== true ? (
              <Alert className="my-2" variant="filled" severity={classStatus}>
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
              value={user !== false ? inputValues.nome : ""}
            >
              {" "}
            </TextField>
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
                value={user !== false ? inputValues.aniversario : selectedDate}
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
              value={user !== false ? inputValues.telefone : ""}
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
              value={user !== false ? inputValues.email : ""}
            ></TextField>
            {userType === "Aluno" ? (
              user !== false ? (
                <div className="mt-3" id="trilha_div">
                  <InputLabel style={{ textAlign: "left" }} id="label-trilha">
                    Trilha
                  </InputLabel>
                  <Select
                    defaultValue={trilhasUser}
                    isMulti
                    labelId="label-trilha"
                    options={trilhas}
                    placeholder="Selecione"
                    onChange={handleChangeTrilha}
                  />
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            <Button
              type="button"
              variant="contained"
              fullWidth
              color="primary"
              size="large"
              className="mb-3 mb-md-4 mt-4"
              onClick={() => onSubmit()}
            >
              Editar
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
