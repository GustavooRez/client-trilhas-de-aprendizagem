import React from "react";
import Container from "@material-ui/core/Container";

export default function Inicio() {
  return (
    <div>
      <Container>
        <div style={{ textAlign: "center", paddingTop: "7%"}}>
          <h1 className="font-weight-bold">Sistema de trilha de aprendizagem</h1>
        </div>
        <Container>
          <div className="text-center py-4">
            <img
              className="mb-5"
              style={{ width: "20vh" }}
              src={require("../../images/logografo.png")}
              alt="logo"
            />
          </div>
          <div style={{ fontSize: "1.2rem"}}>
            <h3 style={{textAlign: "center"}} className="pt-1 pb-4">Seja bem vindo ao sistema de trilha de aprendizagem!</h3>
            <div className="py-1">
              Este projeto faz parte do trabalho final de graduação do aluno
              Gustavo Rezende de Almeida, orientado pela professora Dra. Elisa de Cássia Silva Rodrigues e co-orientado pela professora Dra. Lina Maria Garcés Rodriguez.
            </div>

            <div className="py-1">
              Este projeto tem como finalidade oferecer uma nova visão das
              trilhas de aprendizagem através de um modelo baseado em grafos e
              gamificação! Tenha um ótimo aprendizado!
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
}
