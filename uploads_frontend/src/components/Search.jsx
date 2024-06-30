import React, { useEffect, useState } from 'react';
import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './spinner';

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   if(searchTerm){
    setLoading(true);
    const query = searchQuery(searchTerm.toLowerCase());

    client.fetch(query)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })

   }else{
    client.fetch(feedQuery)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
   }
  },[searchTerm])

  return (
    <div>
      {loading && <Spinner message="searching for pins..."/>}
      {pins?.length !== 0 && <MasonryLayout pins={pins}/>}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className=''><h2>No Pins found</h2></div>
      )}
    </div>
  )
}

export default Search