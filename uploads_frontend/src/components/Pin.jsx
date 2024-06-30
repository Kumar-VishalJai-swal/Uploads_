import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import './Pin.css'
import { client, urlFor } from '../client'
import {  Link, useNavigate } from 'react-router-dom';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();

    const { postedBy, image, _id, destination } = pin;
    const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();


    let alreadySaved = pin?.save?.filter((item) => item?.postedBy?._id === user?.googleId);

    alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user?.googleId,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.googleId,
          },
        }])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };
    const deletePin = (id) => {
        client
         .delete(id)
         .then(() => {
            window.location.reload();
         });
    };
   
  return (
    <div>
        <div onMouseEnter={() => setPostHovered(true)} 
             onMouseLeave={() => setPostHovered(false)} 
             onClick={() => navigate(`/pin-detail/${_id}`)} 
             className='pin-after-hover'>

            <img className='Pin-image' src={urlFor(image).width(250).url()} alt="user-post" loading='lazy'/>
            {postHovered && (
                <div className='postHovered-div'>
                    <div className='postHovered-inner-div'>
                        <div className='postHovered-inner'>
                            <a href={`${image?.asset?.url}?dl=`} download onClick={(e) => e.stopPropagation()} className='download-a-tag'>
                                <MdDownloadForOffline />
                            </a>
                        </div>

                        {alreadySaved?.length !== 0 ? (
                         <button type="button" className="saveButton">
                            {pin?.save?.length}  Saved
                         </button>
                         ) : (
                          <button
                          onClick={(e) => {
                           e.stopPropagation();
                           savePin(_id);
                            }}
                             type="button"
                            className="saveButton"
                           >
                          {pin?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                         </button>
                        )}


                        
                    </div>
                    <div className="postHover_redirect_link">
                        {destination && (
                            <a href={destination} target='_blank' rel='noreferrer' className='postHover_redirect_link_a-tag'>
                                <BsFillArrowUpRightCircleFill /> {destination.slice(0, 22)}
                            </a>
                        )}
                        {postedBy?._id === user.googleId && (
                            <button type='button' onClick={(e) => {
                                e.stopPropagation();
                                deletePin(_id);

                            }} className='deleteButton'><AiTwotoneDelete />  </button>
                        )}
                        
                    </div>
                </div>
            )}
        </div>
        <Link to={`user-profile/${postedBy?._id}`} className='post_owner'>
          <img className='post_owner-image' src={postedBy?.image} alt='user-profile'/><p className='post_owner-name'>{postedBy?.userName}</p>
        </Link>

        
    </div>
  )
}

export default Pin