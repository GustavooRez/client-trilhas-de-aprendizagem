import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@mui/material/Alert";
const axios = require("axios").default;

function CriarConteudo() {
  const userId = localStorage.getItem("userId");
  var userType = localStorage.getItem("usertype");
  const [inputValues, setInputValues] = useState({
    titulo: "",
    descricao: "",
    codigo: "",
    ch_teorica: "",
    ch_pratica: "",
    docente: "",
  });
  const [trilhas, setTrilha] = React.useState([]);
  const [professores, setProfessores] = React.useState([]);
  const [trilhaSelected, setTrilhaSelected] = React.useState([]);
  const [preRequisitos, setPreRequisito] = React.useState([]);
  const [docenteSelected, setDocenteSelected] = React.useState([]);
  const [preRequisitosSelected, setPreRequisitosSelected] = React.useState([]);
  var [status, setStatus] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    axios
      .get(userType === "Admin" ? `${process.env.REACT_APP_API_URL}/trails` : `${process.env.REACT_APP_API_URL}/trails/users/${userId}`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((datas) => {
        datas.data.forEach((data) => {
          trilhas.push({
            value: data.id,
            label: data.titulo,
          });
        });
        setTrilha(trilhas);
      });
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/type`,
        { tipo_usuario: "Professor" },
        {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        }
      )
      .then((profs) => {
        profs.data.forEach((prof) => {
          professores.push({
            value: prof.id,
            label: prof.nome,
          });
        });
        setProfessores(professores);
      });
  }, []);

  const handleChangeMultipleTrilha = (event) => {
    let trilhasPesquisar = [];
    event.forEach((evento) => {
      trilhasPesquisar.push(evento.value);
    });

    setTrilhaSelected(trilhasPesquisar);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/trails/content`,
        { trilhas: trilhasPesquisar },

        {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        }
      )
      .then((datas) => {
        datas.data.forEach((data) => {
          preRequisitos.push({
            value: data.id,
            label: data.codigo,
          });
        });
        setPreRequisito(preRequisitos);
      });
  };

  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });

  function onSubmit() {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/contents`,
        {
          titulo: inputValues.titulo,
          descricao: inputValues.descricao,
          codigo: inputValues.codigo,
          ch_teorica: inputValues.ch_teorica,
          ch_pratica: inputValues.ch_pratica,
          docentes: docenteSelected,
          trilhas: trilhaSelected,
          pre_requisitos: preRequisitosSelected,
          id_usuario: userId
        },
        {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === 200) {
          return navigate(`/conteudo/${res.data.conteudo.id}`);
        } else {
          setStatus(res.data.error);
        }
      });
  }

  const handleChangeMultiplePreRequisitos = (event) => {
    let prerequisitosPesquisar = [];
    event.forEach((evento) => {
      prerequisitosPesquisar.push(evento.value);
    });

    setPreRequisitosSelected(prerequisitosPesquisar);
  };

  const handleChangeMultipleDocente = (event) => {
    let docenteSelecionado = [];
    event.forEach((evento) => {
      docenteSelecionado.push(evento.value);
    });

    setDocenteSelected(docenteSelecionado);
  };
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className="mt-3 mt-md-5">
          <div className="text-center">
            <Typography className="mb-5 font-weight-bold" component="h1" variant="h4">
              Criar conteúdo
            </Typography>
            {status !== true ? (
              <Alert className="mt-2 mb-3" variant="filled" severity="error">
                {status}
              </Alert>
            ) : (
              ""
            )}
            <div>
              <InputLabel style={{ textAlign: "left" }} id="label-trilha">
                Trilha
              </InputLabel>
              <Select
                isMulti
                labelId="label-trilha"
                options={trilhas}
                placeholder="Selecione"
                onChange={handleChangeMultipleTrilha}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="titulo"
                label="Titulo"
                name="titulo"
                type="titulo"
                onChange={handleOnChange}
              ></TextField>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="descricao"
                label="Descrição"
                name="descricao"
                type="descricao"
                onChange={handleOnChange}
              ></TextField>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="codigo"
                label="Código"
                name="codigo"
                type="codigo"
                onChange={handleOnChange}
              ></TextField>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="ch_teorica"
                label="Carga Horária Teórica"
                name="ch_teorica"
                type="ch_teorica"
                onChange={handleOnChange}
              ></TextField>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="ch_pratica"
                label="Carga Horária Prática"
                name="ch_pratica"
                type="ch_pratica"
                onChange={handleOnChange}
              ></TextField>
              <InputLabel style={{ textAlign: "left" }} id="label-docente">
                Docente
              </InputLabel>
              <Select
                isMulti
                labelId="label-docente"
                options={professores}
                placeholder="Selecione"
                onChange={handleChangeMultipleDocente}
              />
              <InputLabel
                style={{ textAlign: "left" }}
                className={"mt-3"}
                id="label-pre-requisitos"
              >
                Pré Requisitos
              </InputLabel>
              <Select
                isMulti
                labelId="label-pre-requisitos"
                options={preRequisitos}
                placeholder="Selecione"
                onChange={handleChangeMultiplePreRequisitos}
              />
              {/* <Button
                type="button"
                variant="contained"
                fullWidth
                color="primary"
                size="large"
                className="mb-3 mb-md-4 mt-4"
                onClick={() => addTopico()}
              >Adicionar tópico</Button>
              <div id="topicos"></div> */}
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
        </div>
      </Container>
    </div>
  );
}

export default CriarConteudo;
