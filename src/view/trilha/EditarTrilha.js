import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Container from "@material-ui/core/Container";
import "date-fns";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@mui/material/Alert";
const axios = require("axios").default;

export default function EditarTrilha() {
  const { id } = useParams();
  const [inputValues, setInputValues] = useState({
    titulo: "",
    descricao: "",
    codigo: "",
  });
  const [trilha, setTrilha] = React.useState(false);
  var [classStatus, setClassStatus] = useState("");
  var [status, setStatus] = useState(true);

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/trails/${id}}`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((res) => {
        setInputValues({
          titulo: res.data.titulo,
          descricao: res.data.descricao,
          codigo: res.data.codigo,
        });
        setTrilha(true);
      });
  }, []);

  const handleOnChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  });

  function onSubmit() {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/trails/${id}`,
        {
          titulo: inputValues.titulo,
          descricao: inputValues.descricao,
          codigo: inputValues.codigo,
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
              Editar trilha
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
              label="Titutlo"
              name="titulo"
              onChange={handleOnChange}
              value={trilha !== false ? inputValues.titulo : ""}
            >
              {" "}
            </TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="descricao"
              label="Descrição"
              name="descricao"
              onChange={handleOnChange}
              value={trilha !== false ? inputValues.descricao : ""}
            ></TextField>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="codigo"
              label="Código"
              name="codigo"
              onChange={handleOnChange}
              value={trilha !== false ? inputValues.codigo : ""}
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
              Editar
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
