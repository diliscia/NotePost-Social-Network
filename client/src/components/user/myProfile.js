import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../../App.css';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import { AuthContext, UserContext } from "../components/UserContext";

function MyProfile() {

    let navigate = useNavigate();


    const [profile, setProfile] = useState([])
    const username = localStorage.getItem('username')

    useEffect(() => {
        Axios.get(`http://localhost:3001/${username}`, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }).then((response) => {
            console.log(response);
            setProfile(response.data[0])
         }).catch((error)=>{
            navigate("/");
        });
    },[]);

    return (
        <div className="container">
        <h1>My Profile</h1>
        <div>
          <div className="mb-3">
            <h5 className="image">Profile Picture:</h5>
            <img src={profile.userImage}></img>
            <h5 className="text">First name: {profile.firstname}</h5>
            <h5 className="text">Last name: {profile.lastname}</h5>
            <h5 className="text">User name: {profile.username}</h5>
            <h5 className="text">Email: {profile.email}</h5>
            {profile.image}
          </div>
        </div>
        {/* <a href={"/user/edit/" + profile.id} className="btn btn-success mx-2">Edit</a> */}
      </div>
    );
}

export default MyProfile;