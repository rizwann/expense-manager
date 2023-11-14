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
  const { resetPassword, errorMessage, emailSent } = useAuth(); // Replace with your reset password function

  const onSubmit: SubmitHandler<ResetPasswordFormInput> = async (data) => {
    try {
      // Call the reset password function
      resetPassword(data);
    } catch (error) {
      // Handle the error or show an error message

      console.error("Password reset failed:", error);
    }
  };

  return (
    <div>
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
                className={inputClassName} // Reuse the inputClassName
                placeholder="Your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    // Add an email validation pattern
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
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
