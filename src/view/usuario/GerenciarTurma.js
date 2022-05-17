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
  let [usuarios, setUsuario] = React.useState([]);
  let [conteudos, setConteudo] = React.useState([]);
  let [conteudoSelected, setConteudoSelected] = React.useState(false);
  let [usuarioSelected, setUsuarioSelected] = React.useState(false);
  let [requisition, setRequisition] = React.useState();
  let [requisitionUser, setRequisitionUser] = React.useState(false);
  const userId = localStorage.getItem("userId");
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${userId}/professor-content`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((datas) => {
        datas.data.conteudos.forEach((data) => {
          conteudos.push({
            value: data.id,
            label: data.titulo,
          });
        });
        setConteudo(conteudos);
      });
      setRequisition(true);
  }, []);

  function searchUsers(valueContent) {
    axios
      .get(`${process.env.REACT_APP_API_URL}/contents/${valueContent}/student-users`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((dataContent) => {
        usuarios.length = 0
        dataContent.data.usuarios.forEach((user) => {
          usuarios.push({
            value: user.id,
            label: `${user.nome}`,
          });
        });
        setUsuario(usuarios);
      });
  }

  const handleChangeConteudos = (event) => {
    setConteudoSelected(event.value);
    searchUsers(event.value)
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
        {requisition === true ? (
          <div style={{ width: "50%", padding: "0 2%" }}>
            <InputLabel style={{ textAlign: "left" }} id="label-trilha">
              Seus conteúdos
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
        {conteudoSelected !== false ? (
          <div style={{ width: "50%" }}>
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
      </Container>
      <Container>
        
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
