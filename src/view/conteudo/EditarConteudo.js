import React, { useState, useCallback } from "react";
import {useParams } from "react-router-dom";
import Container from "@material-ui/core/Container";
import "date-fns";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
import Alert from "@mui/material/Alert";
const axios = require("axios").default;

export default function EditarConteudo() {
  const { id } = useParams();
  const [content, setContent] = React.useState(false);
  const [inputValues, setInputValues] = useState({
    titulo: "",
    descricao: "",
    codigo: "",
    ch_teorica: "",
    ch_pratica: "",
    docente: "",
  });
  const [trilhas, setTrilha] = React.useState([]);
  const [docentes, setDocentes] = React.useState([]);
  const [preRequisitos, setPreRequisito] = React.useState([]);
  const [preRequisitoContent, setPreRequisitoContent] = React.useState([]);
  const [trilhasContent, setTrilhasContent] = React.useState([]);
  const [trilhaSelected, setTrilhaSelected] = React.useState([]);
  const [docentesContent, setDocentesContent] = React.useState([]);
  const [docenteSelected, setDocenteSelected] = React.useState([]);
  const [preRequisitosSelected, setPreRequisitosSelected] = React.useState([]);
  var [classStatus, setClassStatus] = useState("");
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
          docentes.push({
            value: prof.id,
            label: prof.nome,
          });
        });
        setDocentes(docentes);
      });
    axios
      .get(`${process.env.REACT_APP_API_URL}/contents/${id}`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((datas) => {
        setInputValues({
          titulo: datas.data.conteudo.titulo,
          descricao: datas.data.conteudo.descricao,
          codigo: datas.data.conteudo.codigo,
          ch_teorica: datas.data.conteudo.ch_teorica,
          ch_pratica: datas.data.conteudo.ch_pratica,
          docente: datas.data.conteudo.docente,
        });
        var preRequisitoContentSelected = [];
        datas.data.preRequisito.forEach((pre) => {
          preRequisitoContent.push({
            value: pre.id,
            label: pre.codigo,
          });
          preRequisitoContentSelected.push(pre.id);
        });

        setPreRequisitoContent(preRequisitoContent);
        setPreRequisitosSelected(preRequisitoContentSelected);
        var trilhaContentSelected = [];
        datas.data.trilhas.forEach((pre) => {
          trilhasContent.push({
            value: pre.id,
            label: pre.titulo,
          });
          trilhaContentSelected.push(pre.id);
        });
        setTrilhasContent(trilhasContent);
        setTrilhaSelected(trilhaContentSelected);

        var docenteContentSelected = [];
        datas.data.docentes.forEach((doc) => {
          docentesContent.push({
            value: doc.id,
            label: doc.nome,
          });
          docenteContentSelected.push(doc.id);
        });
        setDocentesContent(docentesContent);
        setDocenteSelected(docenteContentSelected);

        let trilhasSearch = [];
        trilhasContent.forEach((trilha) => {
          trilhasSearch.push(trilha.value);
        });

        axios
          .post(
            `${process.env.REACT_APP_API_URL}/trails/content`,
            { trilhas: trilhasSearch },

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

        setContent(true);
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
        preRequisitos.length = 0;
        datas.data.forEach((data) => {
          preRequisitos.push({
            value: data.id,
            label: data.codigo,
          });
        });
        setPreRequisito(preRequisitos);
      });
  };

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
  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });

  function onSubmit() {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/contents/${id}`,
        {
          titulo: inputValues.titulo,
          descricao: inputValues.descricao,
          codigo: inputValues.codigo,
          ch_teorica: inputValues.ch_teorica,
          ch_pratica: inputValues.ch_pratica,
          docentes: docenteSelected,
          trilhas: trilhaSelected,
          pre_requisitos: preRequisitosSelected,
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
            <Typography component="h1" variant="h4" className="font-weight-bold">
              Editar conteúdo
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
              id="titulo"
              label="Titulo"
              name="titulo"
              type="titulo"
              onChange={handleOnChange}
              value={content !== false ? inputValues.titulo : ""}
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
              value={content !== false ? inputValues.descricao : ""}
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
              value={content !== false ? inputValues.codigo : ""}
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
              value={content !== false ? inputValues.ch_teorica : ""}
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
              value={content !== false ? inputValues.ch_pratica : ""}
            ></TextField>

            {content !== false ? (
              <div className="mt-3">
                <InputLabel style={{ textAlign: "left" }} id="label-trilha">
                  Trilha
                </InputLabel>
                <Select
                  required
                  defaultValue={trilhasContent}
                  isMulti
                  labelId="label-trilha"
                  options={trilhas}
                  placeholder="Selecione"
                  onChange={handleChangeMultipleTrilha}
                />
              </div>
            ) : (
              ""
            )}
            {content !== false ? (
              <div className="mt-3">
                <InputLabel style={{ textAlign: "left" }} id="label-docente">
                  Docente
                </InputLabel>
                <Select
                  required
                  defaultValue={docentesContent}
                  isMulti
                  labelId="label-docente"
                  options={docentes}
                  placeholder="Selecione"
                  onChange={handleChangeMultipleDocente}
                />
              </div>
            ) : (
              ""
            )}
            {content !== false ? (
              <div className="mt-3">
                <InputLabel
                  style={{ textAlign: "left" }}
                  id="label-prerequisito"
                >
                  Pre Requisito
                </InputLabel>
                <Select
                  defaultValue={preRequisitoContent}
                  isMulti
                  labelId="label-prerequisito"
                  options={preRequisitos}
                  placeholder="Selecione"
                  onChange={handleChangeMultiplePreRequisitos}
                />
              </div>
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
