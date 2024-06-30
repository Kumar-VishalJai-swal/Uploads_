import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './spinner';
import { categories } from '../utils/data';
import './CreatePin.css'


const CreatePin = ( { user } ) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff'){
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload('image', e.target.files[0] , { contentType : type, filename: name})
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        }).catch((error) => {
          console.log("image upload error", error);
        })
    }
    else{
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    if(title && about && destination && imageAsset?._id && category){
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category,
      }

      client.create(doc)
        .then(() => {
          navigate('/')
        })
    }
    else{
      setFields(true);

      setTimeout(() => setFields(false), 2000)
    }
  }

  return (
    <div className='CreatePin-top-div'>
      {fields && (
        <p className='createPin-Error-Massage'>Please fill in all the fields.</p>
      )}
      <div className="CreatePin-inner-div">
        <div className="CreatePin-inner-div-of-div">
          <div className="createPin-loading-div">
            {loading && <Spinner />}
            {wrongImageType && <p>wrong image type</p>}
            {!imageAsset ? (
              <label >
                <div className="lebel-div">
                  <div className="lebel-inner-div">
                    <p className='lebel-inner-div-p'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p>Click to upload
                    </p>
                  </div>
                </div>
                <input type="file" name='upload-image' onChange={uploadImage} className='image-input' />
              </label>
            ) : (
              <div className="uploaded-pic-div">
                <img src={imageAsset?.url}  alt="uploaded_image" className='uploaded-pic-image' />
                <button type='button' className='uploaded-pic-delete-btn' onClick={() => setImageAsset(null)}><MdDelete /></button>
              </div>
              
            )}
          </div>
        </div>
        <div className="title-div">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Add your title here' className='input-title'/>
          {user && (
            <div className="user-image">
              <img src={user.image} className='user-img' alt="user-profile" />
              <p className='user-name'>{user.userName}</p>
            </div>
          )}
          <input type="text" value={about} onChange={(e) => setAbout(e.target.value)} placeholder='What is your pin about' className='input-about'/>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder='Add a destination link' className='input-about'/>
          <div className="category-div">
            <div>
              <p className='category-p'>Choose Pin category</p>
              <select onChange={(e) => setCategory(e.target.value)} className='category-select'>
                <option value="other" className='select-options'>Select Category</option>

                {categories.map((category) => (
                  <option className='select-option' value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="save-pin-div">
              <button type='button' onClick={savePin} className='save-pin-btn'>Save Pin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin