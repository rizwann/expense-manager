import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import FormAction from "../Form/formAction";
import PasswordResetConfirmation from "./passwordResetConfirmation";
import { inputClassName } from "./resetPassowordForm";

export type ResetPasswordFormInput = {
  email: string;
};

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>();
  const { resetPassword, errorMessage, emailSent } = useAuth();

  const onSubmit: SubmitHandler<ResetPasswordFormInput> = async (data) => {
    try {
      resetPassword(data);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      {!emailSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-px">
            <div className="my-5">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="text"
                id="email"
                className={`${inputClassName} bg-gray-700 text-gray-200 border-gray-600 placeholder-gray-400`}
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
                <span className="text-red-400">{errors.email.message}</span>
              )}
            </div>
            {errorMessage && <div className="text-red-400">{errorMessage}</div>}
          </div>

          <FormAction text={"Reset Password"} />
        </form>
      ) : (
        <PasswordResetConfirmation />
      )}
    </div>
  );
}

export default ResetPassword;
