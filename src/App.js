import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import {RequireAuth, RequireProfessorAccess, RequireAdminAccess} from "./Private/Private.tsx"

import Login from "./view/login/Login";
import Logout from "./view/login/Logout";
import Grafo from "./view/grafos/Grafo";
import Inicio from "./view/inicio/Inicio";
import CriarTrilha from "./view/trilha/CriarTrilha";
import Trilhas from "./view/trilha/Trilhas";
import Trilha from "./view/trilha/Trilha";
import Conteudos from "./view/conteudo/Conteudos";
import Conteudo from "./view/conteudo/Conteudo";
import CriarUsuario from "./view/usuario/CriarUsuario";
import EditarUsuario from "./view/usuario/EditarUsuario";
import EditarConteudo from "./view/conteudo/EditarConteudo";
import EditarTrilha from "./view/trilha/EditarTrilha";
import CriarUsuarios from "./view/usuario/CriarUsuarios";
import ConteudosUsuarios from "./view/usuario/ConteudosUsuarios";
import GerenciarTurma from "./view/usuario/GerenciarTurma";
import CriarConteudo from "./view/conteudo/CriarConteudo";
import InteresseAdministrador from "./view/usuario/InteresseAdministrador"
import Navbar from "./components/Navbar";
import "./css/css.css";
function App() {
  return (
      
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/grafo" element={<RequireAuth > <Navbar /> <Grafo /> </RequireAuth> } />
          <Route path="/criar-trilha" element={<RequireAuth ><RequireProfessorAccess><Navbar /> <CriarTrilha /> </RequireProfessorAccess></RequireAuth> } /> 
          <Route path="/criar-usuario" element={ <CriarUsuario /> } /> 
          <Route path="/interesse" element={<InteresseAdministrador />} />
          <Route path="/editar-usuario" element={<RequireAuth > <Navbar /> <EditarUsuario /></RequireAuth> } /> 
          <Route path="/editar-conteudo/:id" element={<RequireAuth ><RequireProfessorAccess> <Navbar /> <EditarConteudo /></RequireProfessorAccess></RequireAuth> } /> 
          <Route path="/editar-trilha/:id" element={<RequireAuth ><RequireProfessorAccess> <Navbar /> <EditarTrilha /></RequireProfessorAccess></RequireAuth> } /> 
          <Route path="/criar-conteudo" element={<RequireAuth > <RequireProfessorAccess><Navbar /> <CriarConteudo /></RequireProfessorAccess> </RequireAuth>} /> 
          <Route path="/conteudos-usuarios" element={<RequireAuth > <RequireProfessorAccess><Navbar /> <ConteudosUsuarios /></RequireProfessorAccess> </RequireAuth>} /> 
          <Route path="/gerenciar-turma" element={<RequireAuth > <RequireProfessorAccess><Navbar /> <GerenciarTurma /></RequireProfessorAccess> </RequireAuth>} /> 
          <Route path="/criar-usuarios" element={<RequireAuth ><RequireAdminAccess> <Navbar /> <CriarUsuarios /></RequireAdminAccess> </RequireAuth>} /> 
          <Route path="/trilhas" element={<RequireAuth > <Navbar /> <Trilhas /></RequireAuth>} /> 
          <Route path="/trilha/:id" element={<RequireAuth > <Navbar /> <Trilha /></RequireAuth>} /> 
          <Route path="/conteudos" element={<RequireAuth > <Navbar /> <Conteudos /></RequireAuth>} /> 
          <Route path="/conteudo/:id" element={<RequireAuth > <Navbar /> <Conteudo /></RequireAuth>} /> 
          <Route path="/" element={ <><Navbar /><Inicio /> </> } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
