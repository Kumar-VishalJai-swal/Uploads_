import React from 'react'
import { GoogleLogin} from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';
import loginbackground from '../assets/loginbackground.jpg';


import { client } from '../client';
const Login = () => {
  const navigate = useNavigate();
  const responseGoogleSuccess = (response) => {
    localStorage.setItem('user', JSON.stringify(response.profileObj));

    const { name, googleId, imageUrl } = response.profileObj;

    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    }

    client.createIfNotExists(doc)
    .then(() => {
      navigate('/', { replace:true })
    })
    console.log(response.profileObj);
  }
  const responseGoogleFailur = (response) => {
    console.log("fail", response);
  }
  return (
    <div className='login-toop-div'>
      <div className="login-second-div">
         <img className='loginbackground' src={loginbackground} alt="" />
         <div className='login-div-shadow'>
          <div className="login_div">
            <h1>Uploads</h1>
            <div className="google-button">
              <GoogleLogin 
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                render={(renderProps) => (
                    <button type='button' className='login-button' onClick={renderProps.onClick} disabled={renderProps.disabled}>
                      <FcGoogle className='FcGoogle'/>Sign in with Google
                    </button>
                )}
                onSuccess={responseGoogleSuccess}
                onFailure={responseGoogleFailur}
                cookiePolicy={"single_host_origin"}
                
              />
            </div>
          </div>
         </div>
      </div>
    </div>
  )
}

export default Login