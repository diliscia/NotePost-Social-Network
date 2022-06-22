import React, { useEffect, useState } from "react";
import Axios from "axios";

function Home() {

  const [uploads, setUpload] = useState([])

  useEffect(() => {
    Axios.get("http://localhost:3001/api/posts", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      setUpload(response.data);
    })
  },[]) 

  const styles = {
    width: 600,
  };

  function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + " at " + strTime;
  }

  return (
    <div className="container">
      <div id="fail-updated" className="text-danger"></div>
      {uploads.map((val) => {
        return (
        <div className="card mb-3">
          <div className="card-body bg-warning">
            <h6 className="card-subtitle mb-2 text-muted">{val.userId}</h6>
            <p className="fst-italic">{formatDate(new Date (Date.parse(val.createdAt)))}</p>
            <p className="card-text">
              {val.postText}
            </p>
            <img style={styles} src={val.postImage}/>
          </div>
        </div>
        )
      })} 
      
    </div>
  );
}

export default Home;
