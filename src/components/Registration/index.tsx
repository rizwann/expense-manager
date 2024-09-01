import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import FormAction from "../Form/formAction";
import { inputClassName } from "../Login";

export type RegistrationFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  name: string;
};

function Registration() {
  const { registration, errorMessage } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormInput>();
  const password = useRef({});
  password.current = watch("password", "");

  const passwordPattern = /^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{6,}$/;

  return (
    <form
      onSubmit={handleSubmit((data) => registration(data))}
      className="p-6 mt-8 space-y-6 bg-gray-800 rounded-lg shadow-md"
    >
      <div className="">
        <div className="my-5">
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            type="text"
            id="name"
            className={inputClassName}
            placeholder="Your Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-red-400">{errors.name.message}</span>
          )}
        </div>
        <div className="my-5">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={inputClassName}
            placeholder="Your email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <span className="text-red-400">{errors.email.message}</span>
          )}
        </div>
        <div className="my-5">
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            type="text"
            id="username"
            className={inputClassName}
            placeholder="Your username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 5,
                message: "Username must be at least 5 characters long",
              },
            })}
          />
          {errors.username && (
            <span className="text-red-400">{errors.username.message}</span>
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
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: passwordPattern,
                message:
                  "Password must be at least 6 characters and contain a special character.",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-400">{errors.password.message}</span>
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
              required: "Please confirm your password",
              validate: (value) =>
                value === password.current || "The passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-400">{errors.confirmPassword.message}</span>
          )}
        </div>

        {errorMessage && <div className="text-red-400">{errorMessage}</div>}
      </div>

      <FormAction text="Register" />
    </form>
  );
}

export default Registration;
