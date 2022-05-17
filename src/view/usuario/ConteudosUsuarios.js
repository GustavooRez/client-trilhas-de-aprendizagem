import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import Alert from "@mui/material/Alert";
const axios = require("axios").default;

export default function ConteudosUsuarios() {
  var [status, setStatus] = useState(false);
  let [trilhas, setTrilha] = React.useState([]);
  let [usuarios, setUsuario] = React.useState([]);
  let [conteudos, setConteudo] = React.useState([]);
  let [conteudoSelected, setConteudoSelected] = React.useState(false);
  let [usuarioSelected, setUsuarioSelected] = React.useState(false);
  let [requisition, setRequisition] = React.useState();
  let [requisitionUser, setRequisitionUser] = React.useState(false);
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/trails`, {
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
      .get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((users) => {
        users.data.forEach((user) => {
          usuarios.push({
            value: user.id,
            label: user.nome,
          });
        });
        setUsuario(usuarios);
      });
  }, []);

  const handleChangeTrilha = (event) => {
    setConteudoSelected(false);
    setUsuarioSelected(false);
    setRequisitionUser(false);
    searchContents(event.value);
  };

  function searchContents(valueTrilha) {
    setRequisition(false);
    conteudos = [];
    setConteudo(conteudos);
    axios
      .get(`${process.env.REACT_APP_API_URL}/trails/${valueTrilha}/content`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((dataContent) => {
        dataContent.data.content.forEach((data) => {
          conteudos.push({
            value: data.id,
            label: `${data.codigo} - ${data.titulo}`,
          });
        });
        setConteudo(conteudos);
        setRequisition(true);
      });
  }

  const handleChangeConteudos = (event) => {
    setConteudoSelected(event.value);
    if (usuarioSelected !== false) {
        setRequisitionUser(false)
      searchUser(event.value,usuarioSelected);
    }
  };

  const handleChangeUsuarios = (event) => {
    setUsuarioSelected(event.value);
    searchUser(conteudoSelected,event.value);
  };

  function searchUser(content,user) {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/contents-users-completed`,
        {
          id_usuario: user,
          id_conteudo: content,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        }
      )
      .then((usercontent) => {
        if (usercontent.data.code === 200) {
          setRequisitionUser(1);
        } else if (usercontent.data.code === 201) {
          setRequisitionUser(0);
        }
      });
  }

  function onSubmitChange(num) {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/contents-users`,
        {
          id_usuario: usuarioSelected,
          id_conteudo: conteudoSelected,
          completo: num,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        }
      )
      .then((res) => {
        if (res.data.code === 200) {
          searchUser(conteudoSelected,usuarioSelected);
          setStatus(res.data.message);
          setTimeout(() => {
            setStatus(false);
          }, 5000);
        }
      });
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className="mt-3 mt-md-5">
          <div className="text-center">
            <Typography className="mb-5" component="h1" variant="h4">
              Conteúdos dos usuários
            </Typography>
            {status !== false ? (
              <Alert className="my-2" variant="filled" severity="success">
                {status}
              </Alert>
            ) : (
              ""
            )}
          </div>
        </div>
      </Container>
      <Container className="d-flex align-items-center">
        <div style={{ width: "30%" }}>
          <InputLabel style={{ textAlign: "left" }} id="label-trilha">
            Trilha
          </InputLabel>
          <Select
            labelId="label-trilha"
            options={trilhas}
            placeholder="Selecione"
            onChange={handleChangeTrilha}
          />
        </div>
        {requisition === true ? (
          <div style={{ width: "50%", paddingLeft: "2%" }}>
            <InputLabel style={{ textAlign: "left" }} id="label-trilha">
              Conteúdo
            </InputLabel>
            <Select
              labelId="label-trilha"
              options={conteudos}
              placeholder="Selecione"
              onChange={handleChangeConteudos}
            />
          </div>
        ) : (
          ""
        )}
      </Container>
      <Container>
        {conteudoSelected !== false ? (
          <div style={{ width: "50%", padding: "2% 0" }}>
            <InputLabel style={{ textAlign: "left" }} id="label-usuarios">
              Usuários
            </InputLabel>
            <Select
              labelId="label-usuarios"
              options={usuarios}
              placeholder="Selecione"
              onChange={handleChangeUsuarios}
            />
          </div>
        ) : (
          ""
        )}
        {requisitionUser !== false ? (
          requisitionUser === 0 ? (
            <div>
              <Button
                type="button"
                variant="contained"
                fullWidth
                color="primary"
                size="large"
                className="mb-3 mb-md-4 mt-2"
                onClick={() => onSubmitChange(1)}
              >
                Habilitar conteúdo
              </Button>
            </div>
          ) : (
            <div>
              <Button
                type="button"
                variant="contained"
                fullWidth
                color="secondary"
                size="large"
                className="mb-3 mb-md-4 mt-2"
                onClick={() => onSubmitChange(0)}
              >
                Desabilitar conteúdo
              </Button>
            </div>
          )
        ) : (
          ""
        )}
      </Container>
    </div>
  );
}
