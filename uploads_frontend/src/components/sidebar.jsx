import React from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { categories } from '../utils/data';
import './Sidebar.css'

const isNotActiveStyle = 'isNotActiveStyle';
const isActiveStyle = 'isActiveStyle';



const Sidebar = ({user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false);
  }
  return (
    <div className='Sidebar-top-div'>
      <div className="Sidebar-inner-div">
        <Link to="/" className='Sidebar-first-link' onClick={handleCloseSidebar}>
          <h1 className='logo'>Uploads</h1>
        </Link>
        <div className="Sidebar-options">
          <NavLink
          to="/" className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle} onClick={handleCloseSidebar}>
            <RiHomeFill />
            HOME
          </NavLink>
          <h3 className='Discover-h3'>Discover Categories</h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
            to={`/category/${category.name}`}
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle} onClick={handleCloseSidebar} key={category.name}>
              <img src={category.image} className='category-image'/>
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link to={`user-profile/${user._id}`} className='user-profile-link' onClick={handleCloseSidebar}>
        <img className='user-profile-link-image' src={user.image} alt="" />
        <p>{user.userName}</p>
      </Link>
      )}
    </div>
  )
}

export default Sidebar