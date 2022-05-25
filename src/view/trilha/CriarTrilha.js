import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@mui/material/Alert";
const axios = require("axios").default;

function CriarTrilha() {
  var [status, setStatus] = useState(true);
  const userId = localStorage.getItem("userId");
  const [inputValues, setInputValues] = useState({
    titulo: "",
    descricao: "",
    codigo: "",
  });
  const navigate = useNavigate();

  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });

  function onSubmit() {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/trails`,
        {
          titulo: inputValues.titulo,
          descricao: inputValues.descricao,
          codigo: inputValues.codigo,
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
          return navigate(`/trilha/${res.data.trilha.id}`);
        } else {
          setStatus(res.data.error);
        }
      });
  }
  return (
    <div style={{paddingTop: "2%"}}>
      <Container component="main" maxWidth="xs">
        <div className="mt-3 mt-md-5">
          <div className="text-center">
            <Typography component="h1" variant="h4" className="font-weight-bold mb-5">
              Criar trilha
            </Typography>
            {status !== true ? (
              <Alert className="my-2" variant="filled" severity="error">
                {status}
              </Alert>
            ) : (
              ""
            )}
            <div>
              <TextField
                variant="outlined"
                margin="normal"
                required={true}
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
                required={true}
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
                required={true}
                fullWidth
                id="codigo"
                label="Código"
                name="codigo"
                type="codigo"
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
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default CriarTrilha;
