import React, { useEffect, useState } from "react";
import Axios from "axios";

function Home() {

  const [uploads, setUpload] = useState([])

  useEffect(() => {
    Axios.get("http://localhost:3001/api/posts", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) =>{
      setUpload(response.data);
    })
  },[]) 

  const styles = {
    width: 600,
  };

  return (
    <div className="container">
      {uploads.map((val) => {
        return (
          <div className="card">
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">{val.userId}</h6>
          <p className="card-text">
            {val.postText}
          </p>
          <img style={styles} src={val.postImage}/>
        </div>
      </div>
        )
      } )} 
      
    </div>
  );
}

export default Home;
