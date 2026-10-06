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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        formData,
      );
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem('username', formData.username);
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      
      // window.dispatchEvent(new Event("authChange"));
      alert("Login Successful !");
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        setError("Invalid username or password");
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
          type="text"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
        />
        <div className="login_btn" onClick={handleSubmit}>Login</div>

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
