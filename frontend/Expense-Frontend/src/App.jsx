import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { Route,Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/AdminDashboard"

function App(){


  return(
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Dashboard/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
       <Route path="/profile" element={<Profile/>}></Route>
       <Route path="/admin-dashboard" element={<AdminDashboard/>}></Route>
    </Routes>

    

    </>
    
  )
}

export default App