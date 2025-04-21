import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar'>
      {/*<Link to='/'><p className='title'>O.M.K.DS</p><code>Admin</code></Link>*/}
      <Link to='/'><img className='logo' src={assets.logo} alt="" /><code>Admin Panel</code></Link>
      <img className='profile' src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar
