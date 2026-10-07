import { useState } from "react";
import "../style/Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";


const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    gender: "male",
  });
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_EXPENSE_BACKEND_API_URL || 'https://expense-backend-5ewg.onrender.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    axios
      .post(`${BASE_URL}/api/register/`, formData)
      .then(() => {
        alert("Account created successfully");
        navigate('/login')
        
        setLoading(false);


      })
      .catch((err) => {
        setLoading(false);
        console.error("Signup Error: ", err.response?.data);
      });
  };

  return (
    <div className="signup">
      <h2>Create Account</h2>

      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={formData.username}
            placeholder="Username"
          />
          <input
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            placeholder="First_name"
          />
          <input
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            placeholder="Last_name"
          />
          <input
            type="text"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Email"
          />
          <input
            type="text"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
          />
          <input
            type="text"
            name="phone"
            onChange={handleChange}
            value={formData.phone}
            placeholder="Phone"
          />

          <div className="gender">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              onChange={handleChange}
              value={formData.gender}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button className="sign_btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Signup"}</button>
        </form>
        <div className="login_link">
          <span>Already have account ?</span>
          <Link to={"/login"}><strong>Login</strong></Link>

        </div>
      </div>
    </div>
  );
};

export default Signup;
