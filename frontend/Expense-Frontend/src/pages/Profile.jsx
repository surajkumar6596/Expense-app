import { useState, useEffect } from "react"
import axios from "axios"
import '../style/Profile.css'
import { FaUserCircle, FaCamera,FaEdit,FaTimes, FaFirstAid, FaSignLanguage } from "react-icons/fa"
import {useNavigate} from'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({type:"", text:""})
  const BASE_URL = import.meta.env.VITE_EXPENSE_BACKEND_API_URL;

  const navigate = useNavigate()

  useEffect(()=>{
    fetchProfile()
  },[])


  const fetchProfile = async()=>{
    const token = localStorage.getItem('access_token')

    try{
      const res = await axios.get(`${BASE_URL}/api/profile/`,
        {headers: {Authorization: `Bearer ${token}`}}
      );
      setUser(res.data)
      setFormData(res.data)
      
    } catch(err){
      console.error('Error fetching profile', err)
      setMessage({type:'error', text:'User data not found'})

    }finally{
      setLoading(false)
    }
  }

  const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData((prev)=> ({...prev, [name]:value}))

  }

  const handleFileChange = (e)=>{
    const file = e.target.files[0]
    if(file){
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }


  const handleLogout = ()=>{
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setSaving(true)
    setMessage({type:'', text:''})

    const token = localStorage.getItem('access_token')
    const updateData = new FormData();
    if (formData.first_name) updateData.append('first_name', formData.first_name);
    if (formData.last_name) updateData.append('last_name', formData.last_name);
    if (formData.email) updateData.append('email', formData.email);
    if (formData.phone) updateData.append('phone', formData.phone);
    if (formData.gender) updateData.append('gender', formData.gender);

    if(selectedFile){
      updateData.append('profile_image', selectedFile)
    }

    try{
      const res  = await axios.put(`${BASE_URL}/api/profile/`, updateData,
        {headers:{Authorization:`Bearer ${token}`}},
      );

      setUser(res.data)
      setFormData(res.data)
      setIsEditing(false)
      setMessage({type:'success', text:'Profile succesfully updated'})

    }catch(err){
      console.error('Updated Error', err.response?.data)
      if(err.response?.data){
        const errDetail = JSON.stringify(err.response.data)
        setMessage({teyp:'error', text:`Failed: ${errDetail}`})
      }else{
        setMessage({type:'error', text:'Profile updated failed'})
      }
      

    }finally{
      setSaving(false)
    }
  }

  const getProfileImageSrc = ()=>{
    if(preview) return preview;
    if(user?.profile_image){
      return user.profile_image.startsWith('http')
      ? user.profile_image
      : `${BASE_URL}${user.profile_image}`;
    }
    return null
  }

  if(loading) return <div className="profile_container"><p>Loading profile</p></div>



  return (
    <div className="profile_container">
      <div className="profile_header">

        <button className="edit_toggle_btn" 
          onClick={()=>{setIsEditing(!isEditing); setFormData(user)}}>
          {isEditing? <><FaTimes/>Cancel</> : <><FaEdit/>Edit Profile</>}
        </button>

        <button className="logout_btn" onClick={handleLogout}>Logout</button>
      </div>

      {message.text &&(
        <div className={`message ${message.type}`}>{message.text}</div>  
      )}

      {/*  View mode */}
      {!isEditing ? (
        <div className="profile-view">

          <div className="avatar_section">
            {getProfileImageSrc() ?(
              <img src={getProfileImageSrc()} alt="Profile" className="profile_img" />

            ):(
              <FaUserCircle className="default_avatar_icon"/>
            )}

            <h3>{user?.first_name || user?.username} {user?.last_name || ""}</h3>
            <p className="username_tag">@{user?.username}</p>
          </div>

          <div className="details_grid">
            <div className="detail_item">
              <span className="label">Username:</span>
              <span className="value">{user?.username}</span>
            </div>
            <div className="detail_item">
              <span className="label">Email Address:</span>
              <span className="value">{user?.email || 'Not Provided'}</span>
            </div>
            <div className="detail_item">
              <span className="label">Phone Number</span>
              <span className="value">{user?.phone || 'Not Provided'}</span>
            </div>
            <div className="detail_item">
              <span className="label">Gender:</span>
              <span className="value" style={{ textTransform: 'capitalize' }}>
                {user?.gender || 'Not Provide'}
              </span>
            </div>
          </div>

        </div>
      ):(
        // Edit mode
        <form onSubmit={handleSubmit} className="profile_form">
          <div className="avatar_uploard_section">
            <div className="avatar_preview">
              {getProfileImageSrc()?(
                <img src={getProfileImageSrc()} alt="Profile" className="profile_img" />
              ):(
                <FaUserCircle className="default_avatar_icon"/>
              )}
              <label htmlFor="imageUpload" className="upload_btn_label">
                <FaCamera/>
                <input type="file" id="imageUpload" accept="image/*" onChange={handleFileChange} style={{display:'none'}}/>

              </label>
            </div>
          </div>

          <div className="input_grid">
            <div className="form_group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form_group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form_group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form_group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form_group">
              <label>Gender</label>
              <select name="gender" value={formData.gender || 'male'} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="save_btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

      
        </form>
      )}
    </div>
  )
}

export default Profile