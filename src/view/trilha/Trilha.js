import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Alert from "@mui/material/Alert";
import Link from "@material-ui/core/Link";
import Modal from "react-bootstrap/Modal";
const axios = require("axios").default;

export default function Trilha() {
  const userType = localStorage.getItem("usertype");
  let [trilha, setTrilha] = React.useState();
  let [userContent, setUserContent] = React.useState(null);
  let [requisition, setRequisition] = React.useState();
  var [classStatus, setClassStatus] = useState("");
  var [status, setStatus] = useState(true);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/trails/${id}`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((datas) => {
        setTrilha(datas.data);
        setRequisition(true);
      });

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/trails-users`,
        {
          id_usuario: userId,
          id_trilha: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accesstoken"),
          },
        }
      )
      .then((datas) => {
        if (datas.data.code === 200) {
          setUserContent(true);
        } else {
          setUserContent(false);
        }
      });
  }, []);

  function resgistrarTrilha() {
    if (userContent !== true) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/subscribe-trail`,
          {
            id_usuario: userId,
            id_trilha: id,
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
      .delete(`${process.env.REACT_APP_API_URL}/trails/${id}`, {
        headers: {
          Authorization: localStorage.getItem("accesstoken"),
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          return navigate("/trilhas");
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
                <strong>{trilha.titulo}</strong>
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
                  <strong>Código:</strong> {trilha.codigo}
                </h5>
                <h5>
                  <strong>Descrição:</strong> {trilha.descricao}
                </h5>
                {trilha.id_criador === parseInt(userId) ||  userType === "Admin" ? (
                  <div className="d-flex">
                    <div className="col-6">
                      <Link href={`/editar-trilha/${id}`}>
                        <Button
                          type="button"
                          variant="contained"
                          fullWidth
                          color="secondary"
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
                        color={userContent === true ? "primary" : "secondary"}
                        size="large"
                        className="mb-3 mb-md-4 mt-4"
                        onClick={() => resgistrarTrilha()}
                      >
                        {userContent === true ? "Inscrito" : "Inscrever-se"}
                      </Button>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>
            </Container>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* {trilha.id_criador === parseInt(userId) ? ( */}
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
                Você realmente deseja excluir essa trilha? Ela será
                permanentemente excluida!
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
      {/* ) : (
        ""
      )} */}
    </div>
  );
}
