import { useEffect, useState } from 'react';
import '../style/Navbar.css'
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';



const Navbar = () => {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  const updateUserData = ()=>{
    const storedUser = localStorage.getItem('username')
    const token = localStorage.getItem('access_token')

    if(token && storedUser){
      setUsername(storedUser)
    }else{
      setUsername('')
    }
  }

  useEffect(()=>{
    updateUserData()
    window.removeEventListener('authChange', updateUserData)
    return()=>{
      window.removeEventListener('authChange', updateUserData)
    }
  })

  const userInital = username? username.charAt(0).toUpperCase() : '';




  return (
    <div className="navbar">
        <h2 className="logo">
            💳 ExpenseTracker
        </h2>
        <p className="date">
             Month: Sept 2026 ▾ 
        </p>

        {username ? (
          <Link to={'/profile'}>
          <strong className='user_icon'>{userInital}</strong>
          </Link>
        ):(
          <Link to={'/login'}>
            <strong className="user_icon"> <FaRegUser /></strong>
          </Link>
        )}
    </div>
  )
}

export default Navbar 