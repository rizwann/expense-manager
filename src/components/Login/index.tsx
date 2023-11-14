import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import FormAction from "../Form/formAction";
import FormExtra from "../Form/formExtra";

export type LoginFormInput = {
  usernameOrEmail: string;
  password: string;
};

export const inputClassName =
  "relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();
  const { login, errorMessage, setEmailSent } = useAuth();

  useEffect(() => {
    setEmailSent(false);
  }, [setEmailSent]);

  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
                // Custom validation logic for username or email must 5 characters long
                value.length >= 5 || "Username must be 5 characters",
            })}
          />
          {errors.usernameOrEmail && (
            <span className="text-red-500">
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
            <span className="text-red-500">Password is required</span>
          )}
        </div>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </div>

      <FormExtra />

      <FormAction text={"Login"} />
    </form>
  );
}

export default Login;
