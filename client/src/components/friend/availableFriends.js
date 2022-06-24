import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../../App.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";


function AvailableFriends() {

    let navigate = useNavigate();

    const [user1Id, setUser1Id] = useState(0);
    const [availableFriends, setAvailableFriends] = useState([]);
    const [request, setRequest] = useState(false)
    const [friend, setFriend] = useState(0)

    useEffect(() => {
        // alert(process.env.REACT_APP_S3) 
        if (localStorage.getItem("token")) {
            setUser1Id(localStorage.getItem('id'))
            // console.log(user1Id)
            Axios.get(`http://localhost:3001/api/availableFriends/${localStorage.getItem('id')}`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setAvailableFriends(response.data)
                // console.log(response.data)
            })
        }
    }, []);

    const makeRequest = (event, user1Id, user2Id) => {
        console.log(event)
        setRequest(true)
        setFriend(user2Id)
        // alert(user1Id + user2Id)
        Axios.post(`http://localhost:3001/api/makeRequest/${user1Id}/${user2Id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            // alert('Hello')
            getAvailableFriends();
            navigate('/add-friend');
        })
    }

    const getAvailableFriends = () => {
        // alert('Bye')
        // console.log('hello')
        // if (!localStorage.getItem("token")) {
        //     setUser1Id(localStorage.getItem('id'))
        Axios.get(`http://localhost:3001/api/availableFriends/${localStorage.getItem('id')}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            // console.log(response)
            setAvailableFriends(response.data)
        })
        // }
    }

    const cancelRequest = (event, user1Id, user2Id) => {
        // console.log(event)
        setRequest(false)
        setFriend(0)
        // alert(user1Id + user2Id)
        Axios.post(`http://localhost:3001/api/cancelRequest/${user1Id}/${user2Id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            // alert('Hello')
            getAvailableFriends();
            navigate('/add-friend');
        })
    }

    const styles = {
        width: 300,
    };

    return (
        <div className="container my-5">
            <h1 className="text-center my-5">Add new Friends</h1>
            {availableFriends.map((u) => (
                <div key={u.id} className="my-5 card p-3">
                    <div className="columns">
                        <table>
                            <tr>
                                <th><img style={styles} src={"https://postnote-app.s3.amazonaws.com/" + u.userImage} alt='user image'></img></th>
                                <th><h3 className='text mx-3'> {u.firstName} {u.lastName}</h3></th>
                            </tr>
                        </table>
                    </div>
                    <div>
                        {/* u.status={u.status} */}
                        {((request === true && friend === u.id) || u.status == 'PENDING') ?
                            <button className="btn btn-primary mx-2" id={u.id} onClick={(event) => { cancelRequest(event, user1Id, u.id) }}>Cancel</button>
                            : <button className="btn btn-primary mx-2" id={u.id} onClick={(event) => { makeRequest(event, user1Id, u.id) }}>Request</button>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AvailableFriends;
