import React, { useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './spinner';
import { useEffect } from 'react';
import './pinDetail.css'


const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [PinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const addComment = () => {
    if(comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", 'comments[-1]', 
        [{comment, 
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false)
        })
    }
  }

  const fetchPinDetails = () => {
    let query  = pinDetailQuery(pinId);

    if(query){
      client.fetch(query)
         .then((data) => {
          setPinDetail(data[0]);

          if(data[0]){
            query = pinDetailMorePinQuery(data[0]);

            client.fetch(query)
              .then((res) => setPins(res));
          }
         })
    }
  }

  useEffect(() => {
     fetchPinDetails();
  }, [pinId])

  if(!PinDetail) return <Spinner message="Loading pin..."/>


  return (
    <>
    <div className='pinDetail-top-div'>
      <div className="post-image-div">
        <img src={PinDetail?.image && urlFor(PinDetail?.image).url()} className='post-img' alt="" />
      </div>
      <div className="btns-top-div">
        <div className="btns-inner-div">
          <div className="download-btn-div">
          <a href={`${PinDetail.image?.asset?.url}?dl=`} download onClick={(e) => e.stopPropagation()} className='download-a-tag'>
                <MdDownloadForOffline />
          </a>
          </div>
          <a href={PinDetail.destination} target='_blank' className='pinDetail-destination-a-tag'>{PinDetail.destination}</a>
        </div>
        <div className='pin-info'>
          <h1 className="title-heading">{PinDetail.title}</h1>
          <p className='about-para'>{PinDetail.about}</p>
        </div>
        <Link to={`/user-profile/${PinDetail.postedBy?._id}`} className='post_owner'>
          <img className='post_owner-image' src={PinDetail.postedBy?.image} alt='user-profile'/><p className='post_owner-name'>{PinDetail.postedBy?.userName}</p>
        </Link>
        <h2 className='comments-heading'>Comments</h2>
        <div className='comments-div'>{PinDetail?.comments?.map((comment, i) => (
          <div className="single-comment" key={i}>
            <Link to={`/user-profile/${comment.postedBy?._id}`} className='post_owner'>
                <img src={comment.postedBy.image} alt="user-profile" className='single-comment-img' />
                <div className="single-comment-para-div">
                   <p className='single-comment-username'>{comment.postedBy.userName}</p>
                   <p className='single-comment-p'>{comment.comment}</p>
                </div>
            </Link>
          </div>
        ))}</div>
        <div className="create-comment-div">
        <Link to={`/user-profile/${PinDetail.postedBy?._id}`} className='post_owner'>
          <img className='post_owner-image' src={PinDetail.postedBy?.image} alt='user-profile'/>
        </Link>
        <input type="text" className='input-comment' placeholder='Add a comment' value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type='button' className='add-comment-btn' onClick={addComment}>{addingComment ? 'posting the comment...' : 'post'}</button>
        </div>
      </div>
    </div>
    {pins?.length > 0 ? (
      <>
      <h2 className='more-like-this-post'>More like this</h2>
      <MasonryLayout pins={pins}/>
      </>
    ) : (
      <Spinner  message="Loading more pins..."/>
    )}
    </>
  )
}

export default PinDetail