import React, { useState, useEffect, Component } from "react";
import "../../App.css";
import Comment from '../comment/comment';
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function MyProfile() {
  let navigate = useNavigate();

  const [profile, setProfile] = useState([]);
  const [uploads, setUpload] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/profile`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setProfile(res.data[0]);
      })
      .catch((error) => {
        navigate("/");
      });

      Axios.get("http://localhost:3001/api/posts", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).then((response) => {
        setUpload(response.data);
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
        <div className="col-3 my-3">
          <h1>My Profile</h1>
          <div>
            <div className="">
              <img
                className="photo img-fluid"
                style={styles}
                src={"https://postnote-app.s3.amazonaws.com/" + profile.userImage}
              ></img>
              <div className="mx-4">
                <a href={"/edit-image"} className="btn btn-secondary my-2 mx-2">
                    Edit Image
                </a>
              </div>
            </div>
            <div className="mb-3">
              <h5 className="text">First name: {profile.firstname}</h5>
              <h5 className="text">Last name: {profile.lastname}</h5>
              <h5 className="text">User name: {profile.username}</h5>
              <h5 className="text">Email: {profile.email}</h5>
            </div>
          </div>
          <div className="mx-4">
          <a href={"/edit-profile"} className="btn btn-secondary mx-2">
            Edit Profile
          </a>
          </div>
          {/* <Link to={"/edit-profile"} ><button type="button" className="btn btn-outline-dark me-3">Edit</button></Link> */}
        </div>

        <div className="col-9">
          {uploads.map((val) => {
            return (
              <div className="card mt-3">
                <div className="card-body">
                  <div className="d-inline align-top">
                    <img
                      className="photo rounded-circle"
                      style={profilepicture}
                      src={"https://postnote-app.s3.amazonaws.com/"+ profile.userImage}
                    ></img>
                  </div>
                  <h6 className="card-subtitle d-inline">{profile.firstname} {profile.lastname}</h6>
                  <p className="">
                    {formatDate(new Date(Date.parse(val.createdAt)))}
                  </p>
                  <h5 className="card-text">{val.postText}</h5>
                  <a className="btn btn-secondary" href={"/update-post/"+ val.id}>Edit</a><span>  </span>
                  <a className="btn btn-danger" href="#" onClick={()=>{deletePost(val.id)}}>Delete</a>
                  {val.postImage === null ? "" : <img
                    className="img-fluid my-2"
                    style={stylesimagepost}
                    src={"https://postnote-app.s3.amazonaws.com/"+ val.postImage}
                  />}
                  <a href={"/comments-of-post/" + val.id}>View all comments</a>
                </div>
                <div>
                  {/* <div>
                    <input type="text" placeholder="Write a comment..."></input>
                    <button>Add Comment</button>
                  </div> */}
                  <div> 
                    
                    {/* <Comment key={val.id} comments={getListOfComments(val.id)}/> */}
                    {/* <Comment /> */}
                    {/* {comment.length !==0 && comment[0].id === val.id ? comment.map((value) => {
                      return (
                        <div>
                            <p>{value.userId}</p>
                            <p>{value.postId}</p>
                            <p>{value.commentText}</p>
                        </div>
                      )
                    }) : ""
                  } */}
                  </div>
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
