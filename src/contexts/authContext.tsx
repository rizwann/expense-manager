import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";  // Import Preferences

import { LoginFormInput } from "../components/Login";
import { RegistrationFormInput } from "../components/Registration";
import { ResetPasswordFormInput } from "../components/ResetPassword";
import { PasswordResetFormInput } from "../components/ResetPassword/resetPassowordForm";
import { House, IUser } from "../types";

axios.defaults.withCredentials = true;
interface AuthContextType {
  user: IUser | null;
  errorMessage: string | null;
  expiredError: string | null;
  login: (data: LoginFormInput) => void;
  registration: (data: RegistrationFormInput) => void;
  logout: () => void;
  resetPassword: (data: ResetPasswordFormInput) => void;
  verifyPasswordReset: (id: string, token: string) => void;
  changeFortgotPW: (
    data: PasswordResetFormInput,
    id: string,
    token: string
  ) => void;
  changeHouse: (code: string | null) => void;
  resetLink: string | null;
  emailSent: boolean;
  verified: boolean;
  selectedHouse: House | null;
  setEmailSent: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setResetLink: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  getUserFromPreferences: () => Promise<IUser | null>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(true);
  const [expiredError, setExpiredError] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const APP_URL = import.meta.env.VITE_API_URL;

  // Helper function to get token from Capacitor Preferences
  const getToken = async () => {
    const { value } = await Preferences.get({ key: "token" });
    return value;
  };

  // Helper function to get user from Capacitor Preferences
  const getUserFromPreferences = async () => {
    const { value } = await Preferences.get({ key: "user" });
    return value ? JSON.parse(value) : null;
  };

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${getToken()}`,  // Fetch the token dynamically
    },
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await getToken();
      const userFromPreferences = await getUserFromPreferences();

      if (token && userFromPreferences) {
        try {
          const response = await axios.get(`${APP_URL}/api/user/${userFromPreferences?._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data);

          if (response.data?.houseCodes.length > 0) {
            try {
              const houseResponse = await axios.get<House>(
                `${APP_URL}/api/houses/${response.data?.houseCodes[0]}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setSelectedHouse(houseResponse.data);
            } catch (error) {
              console.log(error);
            }
          }

          await Preferences.set({
            key: "user",
            value: JSON.stringify(response.data),
          });
        } catch (error) {
          console.log(error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [APP_URL, refresh]);

  const login = async (data: LoginFormInput) => {
    try {
      const isEmail = data.usernameOrEmail.includes("@");

      const loginData = isEmail
        ? { email: data.usernameOrEmail, password: data.password }
        : { username: data.usernameOrEmail, password: data.password };

      const response = await axios.post(`${APP_URL}/api/auth/login`, loginData);
      const token = response.data.token;

      await Preferences.set({ key: "token", value: token });
      await Preferences.set({
        key: "user",
        value: JSON.stringify(response.data.user),
      });
      setUser(response.data.user);
      if(response.data.user.houseCodes.length > 0){
        const house = response.data.user.houses[0]
        setSelectedHouse(house)
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  const logout = async () => {
    await Preferences.remove({ key: "token" });
    await Preferences.remove({ key: "user" });
    setUser(null);
  };

  const registration = async (data: RegistrationFormInput) => {
    try {
      const registerData = {
        email: data.email,
        password: data.password,
        username: data.username,
        name: data.name,
      };

      await axios.post(`${APP_URL}/api/auth/register`, registerData);

      const loginData = {
        usernameOrEmail: data.username,
        password: data.password,
      };

      await login(loginData);
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  const resetPassword = async (data: ResetPasswordFormInput) => {
    try {
      const resetPasswordData = {
        email: data.email,
      };

      await axios.post(`${APP_URL}/forgot-password`, resetPasswordData);

      logout();
      setEmailSent(true);
    } catch (error: any) {
      setEmailSent(false);
      setErrorMessage(error.response ? error.response.data.message : error.message);
    }
  };

  const verifyPasswordReset = async (id: string, token: string) => {
    try {
      await axios.get(`${APP_URL}/reset-password/${id}/${token}`);
      setVerified(true);
    } catch (error: any) {
      setVerified(false);
      setExpiredError(error.response ? error.response.data.message : error.message);
    }
  };

  const changeFortgotPW = async (data: PasswordResetFormInput, id: string, token: string) => {
    const changePasswordData = {
      password: data.newPassword,
    };

    logout();
    try {
      const response = await axios.post(`${APP_URL}/reset-password/${id}/${token}`, changePasswordData);
      console.log(response);
    } catch (error: any) {
      setExpiredError(error.response ? error.response.data.message : error.message);
    }
  };

  const changeHouse = async (code: string | null) => {
    try {
      if (code) {
        const response = await axiosInstance.get<House>(`${APP_URL}/api/houses/${code}`);
        setSelectedHouse(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registration,
        login,
        logout,
        errorMessage,
        expiredError,
        resetPassword,
        verifyPasswordReset,
        changeFortgotPW,
        resetLink,
        setResetLink,
        emailSent,
        verified,
        changeHouse,
        selectedHouse,
        setEmailSent,
        setRefresh,
        setErrorMessage,
        loading,
        getUserFromPreferences,
        getToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
