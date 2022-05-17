import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "react-select";
const axios = require("axios").default;

export default function Conteudos() {
  let [trilhas, setTrilha] = React.useState([]);
  let [conteudos, setConteudo] = React.useState([]);
  let [requisition, setRequisition] = React.useState();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  var userType = localStorage.getItem("usertype");

  function MouseOver(event) {
    event.target.style.cursor = "pointer";
  }

  React.useEffect(() => {
    if(userType === "Admin"){
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
    }else{
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/trails/${userId}`, {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        })
        .then((datas) => {
          datas.data.trilha.forEach((data) => {
            trilhas.push({
              value: data.id,
              label: data.titulo,
            });
          });
          setTrilha(trilhas);
        });
    }
  }, []);

  const handleChangeTrilha = (event) => {
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
            id: data.id,
            titulo: data.titulo,
            descricao: data.descricao,
            codigo: data.codigo,
          });
        });
        setConteudo(conteudos)
        setRequisition(true)
      });
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className="mt-3 mt-md-5">
          <div className="text-center">
            <Typography className="mb-5" component="h1" variant="h4">
              Conteúdos
            </Typography>
          </div>
        </div>
      </Container>
      <Container>
        <div style={{width: "30%"}}>
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
        <div className="row p-2">
          {requisition === true
            ? conteudos.map((conteudo) => (
                <div
                  className="p-1 col-4"
                  onMouseOver={MouseOver}
                  onClick={() => navigate(`/conteudo/${conteudo.id}`)}
                >
                  <div className="card" style={{minHeight: "8rem"}}>
                    <div className="card-body text-center">
                      <h5 className="card-title">
                        {conteudo.titulo}
                      </h5>
                      <p className="card-text">{conteudo.codigo}</p>
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </Container>
    </div>
  );
}
