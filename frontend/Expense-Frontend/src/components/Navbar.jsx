import { useEffect, useState } from "react";
import "../style/Navbar.css";
import { FaRegUser } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMonth =
    searchParams.get("month") || new Date().toISOString().slice(0, 7);

  const [selectedYear, selectedMonth] = currentMonth.split("-");

  const handleYearChange = (e) => {
    setSearchParams({
      month: `${e.target.value}-${selectedMonth}`,
    });
  };

  const handleMonthChange = (e) => {
    setSearchParams({
      month: `${selectedYear}-${e.target.value}`,
    });
  };

  const updateUserData = () => {
    const storedUser = localStorage.getItem("username");
    const token = localStorage.getItem("access_token");

    if (token && storedUser) {
      setUsername(storedUser);
    } else {
      setUsername("");
    }
  };

  useEffect(() => {
    updateUserData();
    window.addEventListener("authChange", updateUserData);
    return () => {
      window.removeEventListener("authChange", updateUserData);
    };
  }, []);

  const userInital = username ? username.charAt(0).toUpperCase() : "";

  return (
    <div className="navbar">
      <h2 className="logo">💳 ExpenseTracker</h2>
      <div className="date">
        <span>Month: </span>

        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="month-selector">
          {Array.from({ length: 12 }, (_, index) => {
            const monthNumber = String(index + 1).padStart(2, "0");

            const monthName = new Date(2000, index, 1).toLocaleString("en-US", {
              month: "long",
            });

            return (
              <option key={monthNumber} value={monthNumber}>
                {monthName}
              </option>
            );
          })}
        </select>

        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="month-selector"
        >
          {Array.from({ length: 10 }, (_, index) => {
            const year = new Date().getFullYear() - 5 + index;

            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <Link to={`/?month=${currentMonth}`}>
        <strong className="dashboard">Dashboard</strong>
      </Link>

      {username ? (
        <Link to={"/profile"}>
          <strong className="user_icon">{userInital}</strong>
        </Link>
      ) : (
        <Link to={"/login"}>
          <strong className="user_icon">
            {" "}
            <FaRegUser />
          </strong>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
