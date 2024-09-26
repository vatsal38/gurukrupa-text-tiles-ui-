import { useState, createContext, useContext, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import AuthServices from "@/services/AuthServices";
import useObjState from "@/components/useObjState";
interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: any;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  authenticateAndRedirect: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
export const useAuth = () => useContext(AuthContext);

function AuthProvider(props: { children: React.ReactNode }) {
  const route = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo, _handleUserInfo, clearUserInfo] = useObjState(
    {}
  );
  const [userData, setUserData, _handleUserData, clearUserData] = useObjState({
    organizationId: "",
    userId: "",
    userRole: [],
  });

  // log out after 30 minutes of inactivity.
  useEffect(() => {
    let inactiveTime = 0;
    if (process.browser) {
      document.addEventListener("mousemove", () => {
        inactiveTime = 0;
      });
      document.addEventListener("keypress", () => {
        inactiveTime = 0;
      });
    }

    const inactiveInterval = setInterval(async () => {
      if (inactiveTime >= 1000 * 60 * 30) {
        inactiveTime = 0;
        AuthServices.logOut();
        route.push("/login");
      }
      inactiveTime += 1000;
    }, 1000);
    return () => clearInterval(inactiveInterval);
  }, []);

  async function authenticateAndRedirect() {
    const decodedToken = AuthServices.getDecodedAccessToken();

    if (decodedToken) {
      setIsAuthenticated(true);
      // route.push("/dashboard");
    } else {
      AuthServices.logOut();
      route.push("/login");
    }
  }

  async function checkAuthentication() {
    const protectedRoutes = ["/forget-password", "/register"];
    const response = AuthServices.handleAuthentication();
    if (
      response === "noAccessToken" &&
      !protectedRoutes.includes(route.pathname)
    ) {
      handleLogout();
    } else if (response === "notValidToken") {
      handleLogout();
    } else if (response === "Authenticated") {
      authenticateAndRedirect();
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    clearUserInfo();
    clearUserData();
    AuthServices.logOut();
    route.push("/login");
  }

  // check by interval and notify 5 min before token expire
  useEffect(() => {
    const interval = setInterval(async () => {
      const isAboutToExpire = AuthServices.isAboutToExpire();
      if (isAboutToExpire) {
        if (
          confirm(
            "Your session will expire in 5 minutes. Please re-login to continue using this application."
          )
        ) {
          AuthServices.logOut();
          route.push("/login");
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const authValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      userInfo,
      setUserInfo,
      userData,
      setUserData,
      authenticateAndRedirect,
    }),
    [isAuthenticated, userInfo, userData]
  );

  return (
    <AuthContext.Provider value={authValue}>
      {props.children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
