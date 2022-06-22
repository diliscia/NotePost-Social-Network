import React, { useState, useEffect, Component } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../../App.css';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import { AuthContext, UserContext } from "../components/UserContext";
import { Link } from "react-router-dom";

function MyProfile() {

    let navigate = useNavigate();


    const [profile, setProfile] = useState([])
    // const id = localStorage.getItem('id')

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/profile`, {
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

    const styles = {
        width: 400,
    };
      
    return (
        <div className="container">
        <h1>My Profile</h1>
        <div>
          <div className="mb-3">
            <h5 className="image">Profile Picture:</h5>
            <img className="photo"  style={styles} src={profile.userImage}></img>
            <h5 className="text">First name: {profile.firstname}</h5>
            <h5 className="text">Last name: {profile.lastname}</h5>
            <h5 className="text">User name: {profile.username}</h5>
            <h5 className="text">Email: {profile.email}</h5>
          </div>
        </div>
        <a href={"/edit-profile"} className="btn btn-success mx-2">Edit</a>
        {/* <Link to={"/edit-profile"} ><button type="button" className="btn btn-outline-dark me-3">Edit</button></Link> */}
      </div>
    );
}

export default MyProfile;