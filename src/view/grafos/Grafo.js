import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "@material-ui/core/Button";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";

function Grafo() {
  const axios = require("axios").default;
  var [requisition, setRequisition] = useState([false]);
  var [graphData, setGraphData] = useState([]);
  const [trilhas, setTrilha] = React.useState([]);
  const [conteudos, setConteudos] = useState([]);
  const [conteudosFilter, setConteudosFilter] = useState([]);
  const [conteudoSelected, setConteudoSelect] = useState([]);
  const [trilhaSelected, setTrilhaSelected] = React.useState([]);
  const [usuarioSimular, setUsuarioSimular] = React.useState([]);
  const [usuarioSimularSelected, setUsuarioSimularSelected] = React.useState([]);
  let colorNode,
    preRequisitoCompleto,
    borderNode,
    lineColor,
    lineWidthContentSelected;
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  var userType = localStorage.getItem("usertype");

  function MouseOver(event) {
    event.target.style.cursor = "pointer";
  }

  const bolaAmarela = {
    borderRadius: "50%",
    display: "inline-block",
    height: "3rem",
    width: "3rem",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 20%) !important",
    border: "1px solid #ececec !important",
    backgroundColor: "#1BD81B",
  };
  const bolaVerde = {
    borderRadius: "50%",
    display: "inline-block",
    height: "3rem",
    width: "3rem",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 20%) !important",
    border: "1px solid #ececec !important",
    backgroundColor: "#FFC701",
  };
  const bolaCinza = {
    borderRadius: "50%",
    display: "inline-block",
    height: "3rem",
    width: "3rem",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 20%) !important",
    border: "1px solid #ececec !important",
    backgroundColor: "#C4C4C4",
  };

  React.useEffect(() => {
    if (userType !== "Aluno") {
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
          if(userType === "Admin"){
            axios
              .post(
                `${process.env.REACT_APP_API_URL}/users/type`,
                {
                  tipo_usuario: "Aluno",
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("accesstoken"),
                  },
                }
              )
              .then((usuarios) => {
                usuarioSimular.push({
                  value: undefined,
                  label: " "
                });
                usuarios.data.forEach((data) => {
                  usuarioSimular.push({
                    value: data.id,
                    label: data.nome,
                  });
                });
                setTrilha(trilhas);
                setUsuarioSimular(usuarioSimular);
              });
          }
        });
    } else {
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
    conteudoSelected.length = 0;
    setConteudoSelect(conteudoSelected);
    searchGrafo(
      event.value,
      conteudoSelected.value,
      usuarioSimularSelected.value
    );
    setTrilhaSelected({
      value: event.value,
      label: event.label,
    });
  };

  const handleChangeUsuario = (event) => {
    usuarioSimularSelected.length = 0;
    setUsuarioSimularSelected(usuarioSimularSelected);
    searchGrafo(trilhaSelected.value, conteudoSelected.value, event.value);
    setUsuarioSimularSelected({
      value: event.value,
      label: event.label,
    });
  };

  const handleChangeConteudo = (event) => {
    setConteudoSelect({
      value: event.value,
      label: event.label,
    });
    searchGrafo(
      trilhaSelected.value,
      event.value,
      usuarioSimularSelected.value
    );
  };

  function searchGrafo(valueTrilha, valueConteudo, valueUsuario) {
    if (valueTrilha !== undefined) {
      const user = valueUsuario === undefined ? userId : valueUsuario;
      setRequisition(false);
      graphData.length = 0;
      setGraphData(graphData);
      conteudos.length = 0;
      setConteudos(conteudos);
      conteudosFilter.length = 0;
      setConteudosFilter(conteudosFilter);
      axios
        .get(`${process.env.REACT_APP_API_URL}/trails/${valueTrilha}/content`, {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        })
        .then((dataContent) => {
          var bestTrail = [];
          if (valueConteudo !== undefined && valueConteudo.length !== 0) {
            axios
              .get(
                `${process.env.REACT_APP_API_URL}/contents/${valueConteudo}/search-pre-requisites`,
                {
                  headers: {
                    Authorization: localStorage.getItem("accesstoken"),
                  },
                }
              )
              .then((contentsSearched) => {
                if (contentsSearched.data.status === 200) {
                  bestTrail = contentsSearched.data.conteudo;
                  searchGraph2(bestTrail, dataContent, user, valueConteudo);
                }
              });
          } else {
            searchGraph2(bestTrail, dataContent, user, undefined);
          }
        });
    }
  }

  function searchGraph2(bestTrail, dataContent, user, contentFinal) {
    const trilhaGraph = dataContent.data.trilha;
    graphData.push({
      data: {
        type: "star",
        id: `start_${trilhaGraph.id}`,
        label: trilhaGraph.codigo,
        color: "#141460",
      },
    });
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${user}/content-completed`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((user) => {
        dataContent.data.content.forEach((content) => {
          conteudosFilter.push({
            value: content.id,
            label: `${content.codigo} - ${content.titulo}`,
          });
          conteudos.push(content);
          colorNode = "";
          borderNode = "";
          if(content.id === contentFinal){
            borderNode = "blue";
          }else{
            if (bestTrail.includes(content.id)) {
              borderNode = "red";
            } else {
              borderNode = "white";
            }
          }
          if (user.data.userContents.includes(content.codigo)) {
            colorNode = "#FFC701";
          } else {
            preRequisitoCompleto = true;
            if (content.pre_requisito.length === 0) {
              colorNode = "#1BD81B";
            } else {
              content.pre_requisito.forEach((pre_requisito) => {
                if (!user.data.userContents.includes(pre_requisito.codigo)) {
                  preRequisitoCompleto = false;
                }
              });
              if (preRequisitoCompleto === true) {
                colorNode = "#1BD81B";
              } else {
                colorNode = "#C4C4C4";
              }
            }
          }
          graphData.push({
            data: {
              type: "ellipse",
              id: content.id,
              label: content.codigo,
              color: colorNode,
              border: borderNode,
            },
          });
          content.pre_requisito.forEach((pre_requisito) => {
            if (
              dataContent.data.contentsId.includes(pre_requisito.id_conteudo)
            ) {
              lineColor = "";
              lineWidthContentSelected = "";
              if (
                bestTrail.includes(pre_requisito.id_conteudo) &&
                bestTrail.includes(content.id)
              ) {
                lineColor = "red";
                lineWidthContentSelected = 10;
              } else {
                lineColor = "";
                lineWidthContentSelected = 1;
              }
              graphData.push({
                data: {
                  source: pre_requisito.id_conteudo,
                  target: content.id,
                  lineColor,
                  lineWidth: lineWidthContentSelected,
                },
              });
            }
          });
        });
        setGraphData(graphData);
        setConteudos(conteudos);
        setRequisition(true);
        setConteudosFilter(conteudosFilter);
      });
  }
  const [show, setShow] = useState(false);
  const [showConteudos, setShowConteudos] = useState(false);
  const [lineWidth, setLineWidth] = useState(1);

  const handleChangeCheckbox = (event) => {
    if (event.target.checked === true) {
      setLineWidth(1);
    } else {
      setLineWidth(0);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseConteudos = () => setShowConteudos(false);
  const handleShowConteudos = () => setShowConteudos(true);

  return (
    <div
      style={{
        padding: "1%",
      }}
    >
      <Button
        type="button"
        variant="contained"
        color="secondary"
        style={{ marginLeft: "1%" }}
        onClick={handleShow}
      >
        Filtros
      </Button>
      {requisition === true ? (
        <Button
          type="button"
          variant="contained"
          color="secondary"
          style={{ float: "right", marginRight: "1%" }}
          onClick={handleShowConteudos}
        >
          Conteúdos
        </Button>
      ) : (
        ""
      )}
      <div>
        {requisition === true ? (
          <div className="pt-4 px-3">
            <div
              className="boxItens2"
              style={{
                borderOpacity: "0.7",
                borderRadius: "10px",
                backgroundColor: "#f5f6fe",
              }}
            >
              <CytoscapeComponent
                elements={graphData}
                style={{ width: "100%", height: "70vh" }}
                //adding a layout
                layout={{
                  name: "breadthfirst", //preset, random, grid, circle, concentric, breadthfirst, cose
                  fit: true, //Aqui troca se quiser que ele não apareça por total na tela de carregamento
                  directed: true, //Aqui se ele não quiser direção
                  padding: 10, // Padding da borda para os nós
                  animate: true,
                  animationDuration: 1000,
                  avoidOverlap: true,
                  nodeDimensionsIncludeLabels: true,
                }}
                //adding style sheet
                stylesheet={[
                  {
                    selector: "node",
                    style: {
                      shape: "data(type)",
                      backgroundColor: "data(color)",
                      width: "100px",
                      height: "100px",
                      label: "data(label)",
                      "text-valign": "center",
                      "text-halign": "center",
                      "overlay-padding": "0px",
                      "z-index": "10",
                      "border-width": "10px",
                      "border-color": "data(border)",
                      "border-opacity": "0.5",
                    },
                  },
                  // {
                  //   selector: "node:selected",
                  //   style: {
                  //     "border-width": "6px",
                  //     "border-color": "red",
                  //     "border-opacity": "0.5",
                  //     "background-color": "data(color)",
                  //     "text-outline-color": "#77828C",
                  //   },
                  // },
                  {
                    selector: "label",
                    style: {
                      color: "white",
                      // width: 80,
                      // height: 80,
                      // fontSize: 10,
                      // shape: "rectangle"
                    },
                  },
                  {
                    selector: "edge",
                    style: {
                      width: lineWidth === 1 ? "data(lineWidth)" : lineWidth,
                      // "line-color": "#6774cb",
                      "line-color": "data(lineColor)",
                      "target-arrow-color": "data(lineColor)",
                      "target-arrow-shape": "triangle",
                      "curve-style": "bezier", //bezier, taxi, haystack,unbundled-bezier, straight
                    },
                  },
                ]}
              />{" "}
            </div>
            <div className="d-flex align-items-center justify-content-around pt-3">
              <div className="d-flex align-items-center">
                <div style={bolaVerde}></div>{" "}
                <div className="pl-2">Conteúdo concluido</div>
              </div>
              <div className="d-flex align-items-center">
                <div style={bolaAmarela}></div>{" "}
                <div className="pl-2">Conteúdo disponível</div>
              </div>
              <div className="d-flex align-items-center">
                <div style={bolaCinza}></div>{" "}
                <div className="pl-2">Conteúdo indisponível</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "10%" }}>
            <h3>As trilhas de aprendizagem oferecem uma visualização via grafo dos conteúdos das trilhas!</h3> 
            <h4 className="pt-2">Por favor, realize a filtragem para possibilitar uma visão personalizada das trilhas! </h4>
          </div>
        )}
      </div>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Filtros</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <InputLabel style={{ textAlign: "left" }} id="label-trilha">
                Trilha
              </InputLabel>
              <Select
                labelId="label-trilha"
                defaultValue={trilhaSelected}
                options={trilhas}
                placeholder="Selecione"
                onChange={handleChangeTrilha}
              />
            </div>
            <div className="col-6">
              <InputLabel style={{ textAlign: "left" }} id="label-conteudo">
                Melhor caminho até o conteúdo
              </InputLabel>
              <Select
                labelId="label-conteudo"
                defaultValue={conteudoSelected}
                options={conteudosFilter}
                placeholder="Selecione"
                onChange={handleChangeConteudo}
              />
            </div>
            {userType === "Admin" ? (
              <div className="col-6 pt-3">
                <InputLabel style={{ textAlign: "left" }} id="label-usuario">
                  Simular usuário
                </InputLabel>
                <Select
                  empty={true}
                  labelId="label-usuario"
                  defaultValue={usuarioSimularSelected}
                  options={usuarioSimular}
                  placeholder="Selecione"
                  onChange={handleChangeUsuario}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-3 d-flex align-items-center">
              <div className="d-flex align-items-center pt-4">
                <InputLabel
                  style={{ textAlign: "left" }}
                  className="m-0"
                  id="exibir-arestas"
                >
                  Exibir arestas
                </InputLabel>
                <Checkbox
                  labelId="exibir-arestas"
                  checked={lineWidth}
                  onChange={handleChangeCheckbox}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showConteudos}
        onHide={handleCloseConteudos}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Conteúdos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "500px", overflowY: "scroll" }}>
          <div className="row">
            {conteudos.map((conteudo) => (
              <div
                className="p-1 col-4"
                onMouseOver={MouseOver}
                onClick={() => navigate(`/conteudo/${conteudo.id}`)}
              >
                <div className="card" style={{ minHeight: "10rem" }}>
                  <div className="card-body text-center">
                    <h5 className="card-title">{conteudo.titulo}</h5>
                    <p className="card-text">{conteudo.codigo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleCloseConteudos}
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Grafo;
