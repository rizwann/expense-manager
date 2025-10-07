import { Link } from "react-router-dom";
import { useState } from "react";
import "../../styles/auth.scss";

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
    <div className="auth-extra">
      <div className="auth-extra__left">
        <input
          id="show-password"
          name="show-password"
          type="checkbox"
          onChange={togglePasswordVisibility}
        />
        <label htmlFor="show-password">Show Password</label>
      </div>

      <div>
        <Link to="/forgot-password" className="auth-extra__link">
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
