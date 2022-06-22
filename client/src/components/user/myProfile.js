import React, { useState, useEffect, Component } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../../App.css";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// import { AuthContext, UserContext } from "../components/UserContext";
import { Link } from "react-router-dom";

function MyProfile() {
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
    width: 200,
  };

  const profilepicture = {
    width: 50,
  };

  const stylesimagepost = {
    width: 2000,
  };

  const [uploads, setUpload] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/posts", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      setUpload(response.data);
    });
  }, []);

  const deletePost = (id) => {
    Axios.delete(`http://localhost:3001/api/delete-post/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response)=>{
        getPostList() 
        navigate("/my-profile")
    })
}

const getPostList = () => {
  Axios.get('http://localhost:3001/api/posts',{
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  }).then((response)=>{
    setUpload(response.data);
  });
}

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
          <h1>My Profile</h1>
          <div>
            <div className="mb-3">
              <img
                className="photo img-fluid"
                style={styles}
                src={profile.userImage}
              ></img>
            <a href={"/edit-image"} className="btn btn-success mx-2">
                Edit Image
            </a>
            </div>
            <div className="mb-3">
              <h5 className="text">First name: {profile.firstname}</h5>
              <h5 className="text">Last name: {profile.lastname}</h5>
              <h5 className="text">User name: {profile.username}</h5>
              <h5 className="text">Email: {profile.email}</h5>
            </div>
          </div>
          <a href={"/edit-profile"} className="btn btn-success mx-2">
            Edit Profile
          </a>
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
                      src={profile.userImage}
                    ></img>
                  </div>
                  <h6 className="card-subtitle d-inline">{profile.username}</h6>
                  <p className="">
                    {formatDate(new Date(Date.parse(val.createdAt)))}
                  </p>
                  <p className="card-text">{val.postText}</p>
                  <a href={"/update-post/"+ val.id}>Edit</a><span> | </span>
                  <a href="#" onClick={()=>{deletePost(val.id)}}>Delete</a>
                  <img
                    className="img-fluid"
                    style={stylesimagepost}
                    src={"https://postnote-app.s3.amazonaws.com/" + val.postImage}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
