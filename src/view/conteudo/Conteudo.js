import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Alert from "@mui/material/Alert";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Modal from "react-bootstrap/Modal";
import Link from "@material-ui/core/Link";
const axios = require("axios").default;

export default function Conteudo() {
  const userType = localStorage.getItem("usertype");
  let [conteudo, setConteudo] = React.useState();
  let [docente, setDocente] = React.useState();
  let [prerequisito, setPreRequisito] = React.useState();
  let [requisition, setRequisition] = React.useState();
  let [userContent, setUserContent] = React.useState(null);
  let [userComplete, setUserComplete] = React.useState(null);
  var [classStatus, setClassStatus] = useState("");
  var [status, setStatus] = useState(true);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/contents/${id}`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((datas) => {
        setConteudo(datas.data.conteudo);
        var docentesList = [];
        datas.data.docentes.map((docente) => {
          docentesList.push(docente.nome);
        });
        setDocente(docentesList);
        var prerequisitosList = [];
        datas.data.preRequisito.map((prerequisito) => {
          prerequisitosList.push(prerequisito.titulo);
        });
        setPreRequisito(prerequisitosList);
        setRequisition(true);
      });

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/contents-users`,
        {
          id_usuario: userId,
          id_conteudo: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        }
      )
      .then((datas) => {
        if (datas.data.code === 200) {
          if(datas.data.completo === 1){
            setUserComplete(true);
          } else{
            setUserComplete(false);
          }
          setUserContent(true);
        } else {
          setUserContent(false);
        }
      });
  }, []);

  function resgistrarCurso() {
    if (userContent !== true) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/subscribe-content`,
          {
            id_usuario: userId,
            id_conteudo: id,
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
            setUserContent(true);
            setClassStatus("success");
            setUserComplete(false);
            setTimeout(() => {
              setStatus(true);
            }, 5000);
          } else {
            setStatus(res.data.error);
            setClassStatus("error");
            setUserContent(false);
            setTimeout(() => {
              setStatus(true);
            }, 5000);
          }
        });
    }
  }

  function handleConfirm() {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/contents/${id}`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          return navigate("/conteudos");
        }
      });
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      {requisition === true ? (
        <div className="px-5">
          <div className="mt-3 mt-md-5">
            <div>
              <Typography
                className="my-5 text-center font-weight-bold"
                component="h1"
                variant="h2"
              >
                <strong>{conteudo.titulo}</strong>
              </Typography>
            </div>

            <Container className="pt-3 telaConteudoTrilha">
              {status !== true ? (
                <Alert className="my-2" variant="filled" severity={classStatus}>
                  {status}
                </Alert>
              ) : (
                ""
              )}
              <div className="boxItens p-3">
                <h5>
                  <strong>Código:</strong> {conteudo.codigo}
                </h5>
                <h5>
                  <strong>Descrição:</strong> {conteudo.descricao}
                </h5>
                <h5>
                  <strong>Docente:</strong>{" "}
                  {docente.length === 0 ? "Nenhum" : docente.join(", ")}
                </h5>
                <h5>
                  <strong>Carga horária teórica:</strong>{" "}
                  {conteudo.ch_teorica === "" ? 0 : conteudo.ch_teorica} horas
                </h5>
                <h5>
                  <strong>Carga horária prática:</strong>{" "}
                  {conteudo.ch_pratica === "" ? 0 : conteudo.ch_pratica} horas
                </h5>
                <h5>
                  <strong>Pre requisitos:</strong>{" "}
                  {prerequisito.length === 0
                    ? "Nenhum"
                    : prerequisito.join(", ")}
                </h5>
              </div>

              {conteudo.id_criador === parseInt(userId)  ||  userType === "Admin" ? (
                <div className="d-flex">
                  <div className="col-6">
                    <Link href={`/editar-conteudo/${id}`}>
                      <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        color="primary"
                        size="large"
                        className="mb-3 mb-md-4 mt-4"
                      >
                        Editar
                      </Button>
                    </Link>
                  </div>
                  <div className="col-6">
                    <Button
                      type="button"
                      variant="contained"
                      fullWidth
                      color="secondary"
                      size="large"
                      className="mb-3 mb-md-4 mt-4"
                      onClick={handleShow}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ) : userType === "Aluno" ? (
                userContent !== null ? (
                  <div className="d-flex pt-5">
                    <Button
                      type="button"
                      variant="contained"
                      fullWidth
                      color={userContent === true ? userComplete === true ? "primary" : "primary" : "secondary"}
                      style={userContent === true ? userComplete === true ? {backgroundColor: "green"} : {"":""} : {"":""}}
                      size="large"
                      className="mb-3 mb-md-4 mt-4"
                      onClick={() => resgistrarCurso()}
                    >
                      {userContent === true ? userComplete === true ? "Concluído" : "Em curso": "Inscrever-se"}
                    </Button>
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </Container>
          </div>
        </div>
      ) : (
        ""
      )}
        <Modal
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Excluir
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h5>
                Você realmente deseja excluir esse conteúdo? Ele será
                permanentemente excluido!
              </h5>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}
