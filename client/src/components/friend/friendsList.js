import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../../App.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { MDBCol } from 'mdb-react-ui-kit';

function FriendsList() {

    let navigate = useNavigate();

    const [user1Id, setUser1Id] = useState(0);
    const [friendsList, setFriendsList] = useState([])
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setUser1Id(localStorage.getItem('id'))
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
        height: 150,
    };

    const acceptRequest = (event, user1Id, user2Id) => {
        console.log(event)
        // setRequest(true)
        // setFriend(user2Id)
        // alert(user1Id + user2Id)
        Axios.put(`http://localhost:3001/api/acceptRequest/${user1Id}/${user2Id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            // alert('Hello')
            getFriendsList();
            navigate('/friendsList');
        })
    }

    const getFriendsList = () => {
        Axios.get(`http://localhost:3001/api/friendsList/${localStorage.getItem('id')}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            // console.log(response)
            setFriendsList(response.data)
        })
    }

    const declineRequest = (event, user1Id, user2Id) => {
        Axios.post(`http://localhost:3001/api/cancelRequest/${user1Id}/${user2Id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            // alert('Hello')
            getFriendsList();
            navigate('/friendsList');
        })
    }

    return (
        <div className="container my-5">
            <h1 className="text-center my-5">Your Friends</h1>
            {friendsList.map((u) => (
                <div key={u.id} className="my-5 card p-3 row">
                    <div className="columns">
                        <table>
                            <tr>
                                <th><img style={styles} src={"https://postnote-app.s3.amazonaws.com/" + u.userImage} alt='user image'></img></th>
                            </tr>
                            <tr>
                                <td>
                                    <h3 className='text mx-3'> {u.firstName} {u.lastName}</h3>
                                </td>
                            </tr>

                            {(u.status == 'PENDING') ?
                                <div>
                                    <button className="btn btn-primary mx-2" id={u.id} onClick={(event) => { acceptRequest(event, user1Id, u.id) }}>Accept</button>
                                    <button className="btn btn-danger mx-2" id={u.id} onClick={(event) => { declineRequest(event, user1Id, u.id) }}>Decline!</button>
                                </div>
                                : null}
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FriendsList