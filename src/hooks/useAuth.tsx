import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../types/Entites";
import { useLocalStorage } from "./useLocalStorage";

interface IAuthContext {
  user: UserModel,
  login: (data: any) => void,
  logout: () => void,
  goLoginPage: () => void
}
const state = {
  user: {} as UserModel,
  login: () => { },
  logout: () => { },
  goLoginPage: () => { }
}
const AuthContext = createContext<IAuthContext>(state);

export const AuthProvider = (props: { children: any }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = async (data: UserModel) => {
    setUser(data);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    setUser(null);
  };
  const goLoginPage = () => {
    navigate("/", { replace: true });
  }
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      goLoginPage
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
