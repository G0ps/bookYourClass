import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}) {

  const role = document.cookie
    .split("; ")
    .find((row) => row.startsWith("role="))
    ?.split("=")[1];

  // Role not allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}