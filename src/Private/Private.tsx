import React from "react";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }: { children: JSX.Element }) {
  var user = localStorage.getItem('accesstoken')
  let auth;
  if (!user) {
    auth = false
  } else {
    auth = true
  }

  if (auth === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function RequireProfessorAccess({ children }: { children: JSX.Element }) {
  var usertype = localStorage.getItem('usertype')
  let access;
  if (usertype === "Professor" || usertype === "Admin") {
    access = true
  } else {
    access = false
  }
  if (access === false) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function RequireAdminAccess({ children }: { children: JSX.Element }) {
  var usertype = localStorage.getItem('usertype')
  let access;
  if (usertype === "Admin") {
    access = true
  } else {
    access = false
  }

  if (access === false) {
    return <Navigate to="/" replace />;
  }

  return children;
}
