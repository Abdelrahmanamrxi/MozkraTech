import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { setAccessToken, removeAccessToken, setRefreshing } from "../../slices/authSlice";
import { getPostAuthRedirectPath } from "../../utils/authRedirect";

function ProtectedRoute() {
  const dispatch = useDispatch();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isRefreshing = useSelector((state) => state.auth.isRefreshing);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (accessToken || bootstrapped) return;

    let canceled = false;

    const restoreSession = async () => {
      dispatch(setRefreshing(true));
      try {
        const response = await axios.post(
          `${backendUrl}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        dispatch(setAccessToken(response.data.accessToken));
      } catch (err) {
        dispatch(removeAccessToken());
      } finally {
        if (!canceled) {
          dispatch(setRefreshing(false));
          setBootstrapped(true);
        }
      }
    };

    restoreSession();
    return () => {
      canceled = true;
    };
  }, [accessToken, backendUrl, bootstrapped, dispatch]);

  if (!accessToken && (isRefreshing || !bootstrapped)) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ message: 'Please Login To Start Accessing' }}
      />
    );
  }

  const redirectPath = getPostAuthRedirectPath(accessToken);
  const isOnSubjectRegister = location.pathname === "/subject-register";

  if (redirectPath === "/subject-register" && !isOnSubjectRegister) {
    return <Navigate to="/subject-register" replace={true} />;
  }

  if (redirectPath === "/dashboard" && isOnSubjectRegister) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;