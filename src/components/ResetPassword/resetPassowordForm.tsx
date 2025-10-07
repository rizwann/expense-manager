import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import FormAction from "../Form/formAction";
import "../../styles/auth.scss";

export type PasswordResetFormInput = {
  newPassword: string;
  confirmPassword: string;
};

export const inputClassName = "auth-input";

function PasswordResetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordResetFormInput>();
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const { verified, verifyPasswordReset, expiredError, changeFortgotPW } =
    useAuth();

  // get the id and token from the url. url should be something like: http://localhost:3000/reset-password/1234567890/hf873hjkhfd
  const { id } = useParams<{ id: string }>() as { id: string };

  // get the token from the url query string. url should be something like: http://localhost:3000/reset-password/1234567890?token=hf873hjkhfd
  const token = new URLSearchParams(window.location.search).get("token") || "";

  // const newPassword = watch("newPassword");
  // const confirmPassword = watch("confirmPassword");
  const passwordPattern = /^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{6,}$/;
  const newPassword = useRef({});
  newPassword.current = watch("newPassword", "");

  useEffect(() => {
    verifyPasswordReset(id, token);
  }, [id, token, verifyPasswordReset]);

  const onSubmit: SubmitHandler<PasswordResetFormInput> = (data) => {
    // Passwords match, you can proceed with resetting the password
    try {
      changeFortgotPW(data, id, token);
      setIsPasswordReset(true);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <>
      {verified ? (
        <div className="auth-fields auth-centered">
          {isPasswordReset ? (
            <div className="auth-fields auth-centered">
              <p className="auth-text-success">
                Your password has been successfully reset.
              </p>
              <p className="auth-text-muted">
                You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="auth-button auth-button--full"
              >
                Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="auth-fields">
                <div className="auth-field">
                  <label htmlFor="newPassword" className="sr-only">
                    Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className={inputClassName}
                    placeholder="New password"
                    {...register("newPassword", {
                      required: true,
                      pattern: {
                        value: passwordPattern,
                        message:
                          "Password must be at least 6 characters and contain a special character.",
                      },
                    })}
                  />
                  {errors.newPassword && (
                    <span className="auth-error">
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>
                <div className="auth-field">
                  <label htmlFor="confirmPassword" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={inputClassName}
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) =>
                        value === newPassword.current ||
                        "The passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <span className="auth-error">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                {/* <div className="my-5">
                  <label htmlFor="newPassword" className="sr-only">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className={inputClassName}
                    placeholder="New Password"
                    {...register("newPassword", {
                      required: "New Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  {errors.newPassword && (
                    <span className="text-red-500">
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>
                <div className="my-5">
                  <label htmlFor="confirmPassword" className="sr-only">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={inputClassName}
                    placeholder="Confirm New Password"
                    {...register("confirmPassword", {
                      required: "Confirm New Password is required",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div> */}
              </div>

              <FormAction text={"Reset Password"} />
            </form>
          )}
        </div>
      ) : (
        <div className="auth-fields auth-centered">
          <p className="auth-text-error">Invalid password reset link</p>
          <p className="auth-text-muted">{expiredError}</p>
          <Link to="/forgot-password" className="auth-button auth-button--full">
            Try again
          </Link>
        </div>
      )}
    </>
  );
}

export default PasswordResetForm;
