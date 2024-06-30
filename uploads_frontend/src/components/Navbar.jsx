import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import './Navbar.css'

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();
  if(!user) return null;
  return (
    <div className='Navbar_top_div'>
      <div className="Navbar_top_second_div">
        <IoMdSearch className='IoMdSearch'/>
        <input type="text" onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search' value={searchTerm} onFocus={() => navigate('/search')} className='input_Search'/>
      </div>
      <div className='Navbar-user'>
        <Link to={`user-profile/${user?._id}`} className='Navbar-first-link'>
          <img src={user.image} alt="user" className='Navbar-user-image' />
        </Link>
        <Link to='create-pin' className='Navbar-second-link'>
          <IoMdAdd />
        </Link>
      </div>
    </div>
  )
}

export default Navbar