import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";
const axios = require("axios").default;

export default function Trilhas() {
  let [trilhas, setTrilha] = React.useState([]);
  let [requisition, setRequisition] = React.useState();
  const navigate = useNavigate();

  function MouseOver(event) {
    event.target.style.cursor = 'pointer';
  }

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
            id: data.id,
            titulo: data.titulo,
            descricao: data.descricao,
            codigo: data.codigo,
          });
        });
        setTrilha(trilhas);
        setRequisition(true);
      });
  }, []);
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className="mt-3 mt-md-5">
          <div className="text-center">
            <Typography className="mb-5 font-weight-bold" component="h1" variant="h4">
              Trilhas
            </Typography>
          </div>
        </div>
      </Container>
      <Container>
        <div className="pt-2 pb-5 text-center">
          <h5>Essas são as trilhas disponíveis no sistema!</h5><h5>Trilhas são um conjunto de conteúdos que permitem, após a inscrição, a realização e conclusão de seus conteúdos!</h5>  
        </div>
        <div className="row">
          {requisition === true
            ? trilhas.map((trilha) => (
                <div className="p-1 col-4" onMouseOver={MouseOver} onClick={() => navigate(`/trilha/${trilha.id}`)}>
                  <div className="card boxItens">
                    <div className="card-body text-center">
                      <h4 className="card-title">
                        {trilha.titulo}
                      </h4>
                      <h5 className="card-text">{trilha.codigo}</h5>
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
