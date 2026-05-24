import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}) {

  const role = localStorage.getItem("role")

  // Role not allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}