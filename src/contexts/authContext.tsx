// auth-context.tsx
import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";

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

  const APP_URL = import.meta.env.VITE_API_URL;
  // Check if the user is already authenticated

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  useEffect(() => {
    const user = (localStorage.getItem("user") !== "undefined" && localStorage.getItem("user") !== null) ? JSON.parse(localStorage.getItem("user") as string) : null;
    if (token && user) {
      const getUpdatedUser = async () => {
        try {
          const response = await axios.get(`${APP_URL}/api/user/${user?._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data);
          if (response.data?.houseCodes.length > 0) {
            try {
              const res = await axios.get<House>(
                `${APP_URL}/api/houses/${response.data?.houseCodes[0]}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setSelectedHouse(res.data);
            } catch (error) {
              console.log(error);
            }
          }

          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          console.log(error);
          logout()
        }
      };
      getUpdatedUser();
      setUser(user);
    }
  }, [APP_URL, token, refresh]);

  console.log(user);

  const login = async (data: LoginFormInput) => {
    try {
      //check if data is email or username
      const isEmail = data.usernameOrEmail.includes("@");

      const loginData = isEmail
        ? { email: data.usernameOrEmail, password: data.password }
        : { username: data.usernameOrEmail, password: data.password };

      const response = await axios.post(`${APP_URL}/api/auth/login`, loginData);
      console.log("login");
      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log(response.data);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    console.log("logout");
  };

  const registration = async (data: RegistrationFormInput) => {
    try {
      const registerData = {
        email: data.email,
        password: data.password,
        username: data.username,
        name: data.name,
      };

      const response = await axios.post(
        `${APP_URL}/api/auth/register`,
        registerData
      );

      console.log(response.data);

      // redirect to success page and then login the user

      const loginData = {
        usernameOrEmail: data.username,
        password: data.password,
      };

      await login(loginData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const resetPassword = async (data: ResetPasswordFormInput) => {
    try {
      const resetPasswordData = {
        email: data.email,
      };

      const response = await axios.post(
        `${APP_URL}/forgot-password`,
        resetPasswordData
      );

      console.log(response);
      logout();
      setEmailSent(true);

      // redirect to success page and then login the user

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setEmailSent(false);
      console.log(error.response);
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(error.message + "!! 😿 " + "Please try again.");
      }
    }
  };

  const verifyPasswordReset = async (id: string, token: string) => {
    try {
      await axios.get(`${APP_URL}/reset-password/${id}/${token}`);
      setVerified(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      setVerified(false);
      if (error.response) {
        setExpiredError(error.response.data.message);
      } else {
        setExpiredError(error.message + "!! 😿 " + "Please try again.");
      }
    }
  };
  const changeFortgotPW = async (
    data: PasswordResetFormInput,
    id: string,
    token: string
  ) => {
    const changePasswordData = {
      password: data.newPassword,
    };
    logout();
    try {
      const response = await axios.post(
        `${APP_URL}/reset-password/${id}/${token}`,
        changePasswordData
      );

      console.log(response);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        setExpiredError(error.response.data.message);
      } else {
        setExpiredError(error.message + "!! 😿 " + "Please try again.");
      }
    }
  };

  const changeHouse = async (code: string | null) => {
    try {
      if (code) {
        const response = await axiosInstance.get<House>(
          `${APP_URL}/api/houses/${code}`
        );
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
        emailSent,
        verified,
        changeHouse,
        selectedHouse,
        setEmailSent,
        setRefresh,
        setErrorMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
