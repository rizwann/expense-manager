import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import FormAction from "../Form/formAction";
import PasswordResetConfirmation from "./passwordResetConfirmation";
import { inputClassName } from "./resetPassowordForm";
import "../../styles/auth.scss";

export type ResetPasswordFormInput = {
  email: string;
};

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>();
  const { resetPassword, errorMessage, emailSent, setErrorMessage } = useAuth();

  const onSubmit: SubmitHandler<ResetPasswordFormInput> = async (data) => {
    try {
      resetPassword(data);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [errorMessage, setErrorMessage]);

  return (
    <>
      {!emailSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-fields">
            <div className="auth-field">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="text"
                id="email"
                className={inputClassName}
                placeholder="Your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="auth-error">
                  {errors.email.message}
                </span>
              )}
            </div>
            {errorMessage && <div className="auth-status">{errorMessage}</div>}
          </div>

          <FormAction text={"Reset Password"} />
        </form>
      ) : (
        <PasswordResetConfirmation />
      )}
    </>
  );
}

export default ResetPassword;
