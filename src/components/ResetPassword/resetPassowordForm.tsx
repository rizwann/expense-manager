import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import FormAction from "../Form/formAction";

export type PasswordResetFormInput = {
  newPassword: string;
  confirmPassword: string;
};

export const inputClassName =
  "relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

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

  console.log(verified);

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
        <div>
          {isPasswordReset ? (
            // Show a confirmation message when the password has been reset
            <div className="mt-8 space-y-6 text-center">
              <p className="text-green-500">
                Your password has been successfully reset.
              </p>
              <p className="text-gray-500">
                You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="relative flex justify-center w-full px-4 py-2 mt-10 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md group hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Log In
              </Link>
            </div>
          ) : (
            // Show the password reset form
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-px">
                <div className="my-5">
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
                    <span className="text-red-500">
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>
                <div className="my-5">
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
                    <span className="text-red-500">
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
        <div className="mt-8 space-y-6">
          <p className="text-red-500">Invalid password reset link</p>
          <p className="text-gray-500">{expiredError}</p>
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="relative flex justify-center w-full px-4 py-2 mt-10 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md group hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Try again
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default PasswordResetForm;
