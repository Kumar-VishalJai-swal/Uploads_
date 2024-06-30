import React from 'react'
import './Loader.css';

const Spinner = ({ message }) => {
  return (
    <div className='loader-div'>
        <div className="container">
           <div className="slice"></div>
           <div className="slice"></div>
           <div className="slice"></div>
           <div className="slice"></div>
           <div className="slice"></div>
           <div className="slice"></div>
        </div>
        <p>{message}</p>
    </div>
  )
}

export default Spinner




