import React from "react";
import Container from "@material-ui/core/Container";

export default function Inicio() {
  return (
    <div>
      <Container>
        <div className="pt-5" style={{ textAlign: "center" }}>
          <h1>Sistema de trilha de aprendizagem</h1>
        </div>
        <Container>
          <div className="text-center py-3">
            <img
              className="mb-5"
              style={{ width: "20vh" }}
              src={require("../../images/logografo.png")}
              alt="logo"
            />
          </div>
          <div style={{ fontSize: "1.2rem"}}>
            <div style={{textAlign: "center",fontSize: "1.4rem"}} className="pt-1 pb-4">Seja bem vindo ao sistema de trilha de aprendizagem!</div>
            <div className="py-1">
              Este projeto faz parte do trabalho final de graduação do aluno
              Gustavo Rezende de Almeida, orientado pela professora Elisa de
              Cassia e co-orientado pela professora Lina Garcez.
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
