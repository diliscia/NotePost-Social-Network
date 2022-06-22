import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [uploads, setUpload] = useState([]);

  let navigate = useNavigate();

  const [profile, setProfile] = useState([]);
  // const id = localStorage.getItem('id')

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/profile`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response);
        setProfile(response.data[0]);
      })
      .catch((error) => {
        navigate("/");
      });
  }, []);

  const styles = {
    width: 1500,
  };

  const profilepicture = {
    width: 50,
  };

  const stylesimagepost = {
    width: 2000,
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/api/allposts", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      setUpload(response.data);
    });
  }, []);

  function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return (
      date.getMonth() +
      1 +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear() +
      " at " +
      strTime
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-3">
          <div className="mt-3">
           
            <div className="d-inline align-top">
              <img
                className="photo img-fluid"
                style={styles}
                src={profile.userImage}
              ></img>
              </div>
              <div className="d-inline">
                <h5 className="text"> {profile.username}</h5>
              </div>
  
          </div>
          {/* <Link to={"/edit-profile"} ><button type="button" className="btn btn-outline-dark me-3">Edit</button></Link> */}
        </div>

        <div className="col-9">
          {uploads.map((val) => {
            return (
              <div className="card mt-3">
                <div className="card-body bg-warning">
                  <div className="d-inline align-top">
                    <img
                      className="photo rounded-circle"
                      style={profilepicture}
                      src={val.userImage}
                    ></img>
                  </div>
                  <h6 className="card-subtitle d-inline">{val.username}</h6>
                  <p className="">
                    {formatDate(new Date(Date.parse(val.createdAt)))}
                  </p>
                  <p className="card-text">{val.postText}</p>
                  {val.postImage === null ? "" : <img
                    className="img-fluid"
                    style={stylesimagepost}
                    src={"https://postnote-app.s3.amazonaws.com/"+ val.postImage}
                  />}
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
