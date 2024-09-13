import { Link } from "react-router-dom";
import { useState } from "react";

export default function FormExtra() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = isPasswordVisible ? "password" : "text";
    }
  };

  return (
    <div className="flex items-center justify-between text-gray-300">
      <div className="flex items-center">
        <input
          id="show-password"
          name="show-password"
          type="checkbox"
          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
          onChange={togglePasswordVisibility}
        />
        <label
          htmlFor="show-password"
          className="block ml-2 text-xs text-gray-300"
        >
          Show Password
        </label>
      </div>

      <div className="text-xs">
        <Link
          to="/forgot-password"
          className="font-medium text-purple-400 hover:text-purple-300"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
