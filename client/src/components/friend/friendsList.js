import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../../App.css';
import Axios from 'axios';

function FriendsList() {
    const [user1Id, setUser1Id] = useState(0);
    const [friendsList, setFriendsList] = useState([])
    useEffect(() => {
        if (localStorage.getItem("token")) {
            Axios.get(`http://localhost:3001/api/friendsList/${localStorage.getItem('id')}`, {
                // Axios.get(`http://localhost:3001/api/friendsList`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setFriendsList(response.data)
                // console.log(response.data)
            })
        }
    }, []);

    const styles = {
        width: 400,
    };

    return (
        <div className="container my-5">
            <h1 className="text-center my-5 text-success">Your Friends</h1>
            {friendsList.map((u) => (
                <div key={u.id} className="my-5 card p-3">
                    {/* <p>id={u.id} user1Id={user1Id} </p> */}
                    <img style={styles} src={process.env.REACT_APP_S3 + u.userImage} alt='user image'></img>
                    <h3 className=' text-primary'>{u.firstName}</h3>
                    <p><i>{u.lastName} </i></p>
                </div>
            ))}
        </div>
    );
}

export default FriendsList