import React, { useDebugValue, useEffect, useState } from "react";
import Axios from "axios";

function Home() {

  const [uploads, setUpload] = useState([])

  useEffect(() => {
    Axios.get("http://localhost:3001/post").then((response) =>{
      setUpload(response.data);
    })
  })

  return (
    <div className="container">
      {uploads.map((val) => {
        return (
          <div className="card">
        <div className="card-body">
          <h5 className="card-title">{val.postText}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{val.userId}</h6>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <img src={val.postImage}/>
        </div>
      </div>
        )
      } )} 
      
    </div>
  );
}

export default Home;
