import React, { useState, useRef, useEffect } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiMenu } from 'react-icons/hi'
import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar, UserProfile } from '../components';
import { client } from '../client';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import './Home.css'
import { fetchUser } from '../utils/fetchUser';


const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef("");

  const userInfo = fetchUser();
  

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query)
    .then((data) => {
      setUser(data[0]);
    })
  }, []);

  useEffect(() => {
     scrollRef.current.scrollTo(0, 0)
  },[]);

  return (
    <div className='home-top-div'>
      <div className='Sidebar-div'>
        <Sidebar user={user && user}/>
      </div>
      <div className='Sidebar-div2'>
        <div className="sidebar-div2-inner">
        <HiMenu className="HiMenu" onClick={() => setToggleSidebar(true)}/>
        <Link to="/">
          <h1 className='logo'>Uploads</h1>
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img className='profile-dp' src={user?.image} alt="" />
        </Link>
        
        </div>
        {toggleSidebar && (
        <div className="AiFillCloseCircle-top-div">
          <div className='AiFillCloseCircle-inner-div'>
            <AiFillCloseCircle className='AiFillCloseCircle' onClick={() => setToggleSidebar(false)}/>
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar}/>
        </div>
      )}
        
      </div>
      
      <div className='scrollRef' ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />}/>
          <Route path="/*" element={<Pins user={user && user}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Home