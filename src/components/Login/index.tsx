import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import FormAction from "../Form/formAction";
import FormExtra from "../Form/formExtra";

export type LoginFormInput = {
  usernameOrEmail: string;
  password: string;
};

export const inputClassName =
  "relative block w-full px-3 py-2 text-gray-200 placeholder-gray-500 border border-gray-600 rounded-md appearance-none bg-gray-800 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();
  const { login, errorMessage, setEmailSent } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setEmailSent(false);
  }, [setEmailSent]);

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    setIsLoggingIn(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    await login(data);
    setIsLoggingIn(false);
  };

  return (
    <>
      {isLoggingIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div className="relative flex flex-col items-center text-white">
            <img
              src="https://i.ibb.co/8xr4L5n/expenses.png" // Replace with your login icon or loading spinner
              alt="Logging in"
              className="w-24 h-24 mb-4 animate-spin"
            />
            <div className="text-2xl animate-pulse">Logging in...</div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 mt-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <div className="space-y-px">
          <div className="my-5">
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
              <span className="text-red-400">
                {errors.usernameOrEmail.message}
              </span>
            )}
          </div>
          <div className="my-5">
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
              <span className="text-red-400">Password is required</span>
            )}
          </div>
          {errorMessage && <div className="text-red-400">{errorMessage}</div>}
        </div>

        <FormExtra />

        <FormAction text={"Login"} />
      </form>
    </>
  );
}

export default Login;
