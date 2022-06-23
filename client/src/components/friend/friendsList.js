import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../../App.css';
import Axios from 'axios';
import { MDBCol } from 'mdb-react-ui-kit';

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
        width: 300,
    };


    return (
        <div className="container my-5">
            <h1 className="text-center my-5">Your Friends</h1>
            {friendsList.map((u) => (
                <div key={u.id} className="my-5 card p-3 row">
                    <div className="columns">
                    <table>
                        <tr>
                        <th><img style={styles} src={"https://postnote-app.s3.amazonaws.com/"+ u.userImage} alt='user image'></img></th>
                        <th><h3 className='text mx-3'> {u.firstName} {u.lastName}</h3></th>
                        </tr>
                    </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FriendsList