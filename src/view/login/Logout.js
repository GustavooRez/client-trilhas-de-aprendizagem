import { useNavigate } from "react-router-dom";
import React from "react";

function Logout() {
  const navigate = useNavigate();
  React.useEffect(() => {
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("username");
      localStorage.removeItem("usertype");
      localStorage.removeItem("userId");
      return navigate("/");
  })
  return (<div></div>);
}

export default Logout;
