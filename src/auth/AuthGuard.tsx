import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";

type AuthGuardProps = {
  authRoles: string;
};

const AuthGuard = ({ authRoles }: AuthGuardProps) => {
  const user = useAppSelector((state) => state.accountStore.user);
  const token = useAppSelector((state) => state.accountStore.tokenStore?.token);
  const location = useLocation();

  const rolesArray = authRoles.split(',').map(role => role.trim().toLowerCase());

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (rolesArray.some(role => user.user.userRole.roleDetails.name.toLowerCase() === role)) {
    return <Outlet />;
  }

  return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default AuthGuard;
