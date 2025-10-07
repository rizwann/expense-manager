import { useState, useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import FormAction from "../Form/formAction";
import FormExtra from "../Form/formExtra";
import { useThemeContext } from "../../context/ThemeContext";
import "../../styles/auth.scss";

export type LoginFormInput = {
  usernameOrEmail: string;
  password: string;
};

export const inputClassName = "auth-input";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();
  const { login, errorMessage, setEmailSent, setErrorMessage } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { colors } = useThemeContext();

  useEffect(() => {
    setEmailSent(false);
  }, [setEmailSent]);

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [errorMessage, setErrorMessage]);

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    setIsLoggingIn(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await login(data);
    setIsLoggingIn(false);
  };

  const overlayBackground = useMemo(() => {
    const hex = colors.background.replace("#", "");
    if (hex.length !== 6) return "rgba(0, 0, 0, 0.8)";
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  }, [colors.background]);

  return (
    <>
      {isLoggingIn && (
        <div className="auth-overlay" style={{ backgroundColor: overlayBackground }}>
          <div className="auth-overlay__content">
            <img
              src={import.meta.env.VITE_LOGO_URL}
              alt="Logging in"
              className="animate-spin"
            />
            <span className="animate-pulse">Logging in...</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="auth-fields">
          <div className="auth-field">
            <label htmlFor="usernameOrEmail" className="sr-only">
              Username or Email
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              className={inputClassName}
              placeholder="Your username or email"
              {...register("usernameOrEmail", {
                required: "Username or Email is required",
                validate: (value) =>
                  value.length >= 5 || "Username must be 5 characters",
              })}
            />
            {errors.usernameOrEmail && (
              <span className="auth-error">
                {errors.usernameOrEmail.message}
              </span>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={inputClassName}
              placeholder="Your password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="auth-error">Password is required</span>
            )}
          </div>
          {errorMessage && <div className="auth-status">{errorMessage}</div>}
        </div>

        <FormExtra />

        <FormAction text={"Login"} />
      </form>
    </>
  );
}

export default Login;
