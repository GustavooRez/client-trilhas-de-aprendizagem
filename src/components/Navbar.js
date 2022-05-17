import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { NavDropdown } from "react-bootstrap";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";

export default function Navbar() {
  var [auth, setAuth] = useState(false);
  var userType = localStorage.getItem("usertype");
  React.useEffect(() => {
    var token = localStorage.getItem("accesstoken");
    if (!token) {
      setAuth(false);
    } else {
      setAuth(true);
    }
  });
  return (
    <>
      <Nav>
        <NavLink to="/">
          <img
            style={{ width: "5vh" }}
            src={require("../images/logografo.png")}
            alt="logo"
          />
        </NavLink>
        <Bars />
        {auth === true ? (
          <NavMenu>
            {userType === "Aluno" ? (
              <NavLink to="/trilhas">Trilhas</NavLink>
            ) : (
              <NavDropdown title="Trilhas" className="dropdownNav">
                <NavDropdown.Item href="/criar-trilha">
                  Criar trilha
                </NavDropdown.Item>
                <NavDropdown.Item href="/trilhas">
                  Visualizar trilhas
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {userType === "Aluno" ? (
              <NavLink to="/conteudos">Conteudos</NavLink>
            ) : (
              <NavDropdown title="Conteudos" className="dropdownNav">
                <NavDropdown.Item href="/criar-conteudo">
                  Criar conteudo
                </NavDropdown.Item>
                <NavDropdown.Item href="/conteudos">
                  Visualizar conteudos
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {userType === "Admin" ?  (
              <NavDropdown title="Usuarios" className="dropdownNav">
                  <NavDropdown.Item href="/criar-usuarios">
                    Criar usuarios
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/conteudos-usuarios">
                    Conteúdos dos usuários
                  </NavDropdown.Item>
              </NavDropdown>
            ) : ""}

            {userType === "Professor" ? (
              <NavDropdown title="Turmas" className="dropdownNav">
                <NavDropdown.Item href="/gerenciar-turma">
                  Gerenciar turmas
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              ""
            )}
            <NavLink to="/grafo">Trilha de aprendizagem</NavLink>
          </NavMenu>
        ) : (
          ""
        )}
        <NavBtn>
          {auth === false ? (
            <NavBtnLink to="/login">Fazer login</NavBtnLink>
          ) : (
            <Dropdown>
              <Dropdown.Toggle style={{backgroundColor: "white", borderColor: "white"}} variant="warning" id="dropdown-basic">
                Olá, {localStorage.getItem("username")}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/editar-usuario">
                  Editar usuário
                </Dropdown.Item>
                <Dropdown.Item href="/logout">Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </NavBtn>
      </Nav>
    </>
  );
}
