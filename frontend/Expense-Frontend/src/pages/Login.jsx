import "../style/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL =
    import.meta.env.VITE_EXPENSE_BACKEND_API_URL ||
    "https://expense-backend-5ewg.onrender.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/login/`, formData);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("username", formData.username);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.access}`;

      window.dispatchEvent(new Event("authChange"));
      alert("Login Successful !");
      navigate("/");
    } catch (err) {
     
      console.error("Login Error:", err.response?.data);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail); // Django SimpleJWT ka standard detail message (jaise "No active account found with the given credentials")
      } else if (err.response?.data) {
        // Agar koi aur validation error hai
        const firstKey = Object.keys(err.response.data)[0];
        setError(`${firstKey}: ${err.response.data[firstKey]}`);
      } else {
        setError("Server error. Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_page">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="container">
        <input
          type="text"
          name="username"
          onChange={handleChange}
          value={formData.username}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
        />
        <div className="login_btn" onClick={handleSubmit}>
          Login
        </div>

        <div className="signup_link">
          <span>Don't have accounts ?</span>
          <Link to={"/signup"}>
            <strong>Signup</strong>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
