import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import { userCreatedPinQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './spinner';
import './UserProfile.css'


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const {userId} = useParams();
  const [createdbgColor, setCreatedBgColor] = useState(true);
  const [saveddbgColor, setSavedBgColor] = useState(false);

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      }, [userId])
  })

  useEffect(() => {
    if(text === 'Created'){
      const CreatedPinsQuery = userCreatedPinQuery(userId);

      client.fetch(CreatedPinsQuery)
        .then((data) => {
          setPins(data);
        })
    }else{
      const SavesdPinsQuery = userSavedPinsQuery(userId);

      client.fetch(SavesdPinsQuery)
        .then((data) => {
          setPins(data);
        })

    }
  }, [text, userId])

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  }

  if(!user){
    return <Spinner message="Loading profile"/>
  }
  return (
    <div className='user-profile-top-div'>
       <div className="user-profile-second-div">
        <div className="user-profile-third-div">
          <div className="user-profile-fourth-div">
            <img src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg" className='randomImage' alt="banner---pic" />
            <div className='user-profile-div'>
              <img src={user.image} className='user-profile-image'  alt="" />
            </div>
            <h1 className='profile-username'>{user.userName}</h1>
          </div>
          <div className='user-logout'>
            {userId === user._id && (
            //    <GoogleLogout 
            //    clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
            //    render={(renderProps) => (
            //        <button type='button' className='logout-button' onClick={renderProps.onClick} disabled={renderProps.disabled}>
            //          <AiOutlineLogout color='red' fontSize={21}/>Logout
            //        </button>
            //    )}
            //    onLogooutSuccess={logout}
               
            //    cookiePolicy={"single_host_origin"}
               
            //  />
            <a href="/login">
              <button type='button' className='logout-button'>
                     <AiOutlineLogout color='red' fontSize={21}/>Logout
              </button>
            </a>
            )}
          </div>
        </div>
        <div className='btns'>
          <button type='button' onClick={(e) => {
            setText(e.target.textContent);
            setActiveBtn('Created');
            setCreatedBgColor(true);
            setSavedBgColor(false)
            }}
             className='activeBtnStyle'
             style={{backgroundColor: createdbgColor ? "red" : "white", color: saveddbgColor ? "black" : "white"}}
             >
               Created
          </button>

          <button type='button' onClick={(e) => {
            setText(e.target.textContent);
            setActiveBtn('saved');
            setSavedBgColor(true);
            setCreatedBgColor(false)
          }}
          className='activeBtnStyle' 
          style={{backgroundColor: saveddbgColor ? "red" : "white", color: saveddbgColor ? "white" : "black"}}
          >
            saved
          </button>
        </div>

        {pins?.length ? (
          <div className="userPins">
          <MasonryLayout pins={pins}/>
        </div>
        ) : (
          <div className="no-found-pins">No pins found!</div>
        )}
       </div>
    </div>
  )
}

export default UserProfile