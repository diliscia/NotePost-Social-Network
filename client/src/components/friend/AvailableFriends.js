import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.js';
import '../../App.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";


function AvailableFriends() {

    let navigate = useNavigate();

    const [user1Id, setUser1Id] = useState(0);
    const [availableFriends, setAvailableFriends] = useState([]);

    const makeRequest = (user1Id, user2Id) => {
        // alert(user1Id + user2Id)
        Axios.post(`http://localhost:3001/api/makeFriendship/${user1Id}/${user2Id}`, {
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
        if (!localStorage.getItem("token")) {
            setUser1Id(localStorage.getItem('id'))
            Axios.get(`http://localhost:3001/api/availableFriends/${localStorage.getItem('id')}`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                console.log(response)
                setAvailableFriends(response.data)
            })
        }
    }

    useEffect(() => {
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

    const styles = {
        width: 400,
      };

    return (
        <div className="container my-5">
            <h1 className="text-center my-5 text-success">Available users that you can request Friendship</h1>
            {availableFriends.map((u) => (
                <div key={u.id} className="my-5 card p-3">
                    {/* <p>id={u.id} user1Id={user1Id} </p> */}
                    <img style={styles} src={u.userImage} alt='user image'></img>
                    <h3 className=' text-primary'>{u.firstName}</h3>
                    <p><i>{u.lastName} </i></p>
                    <div>
                        <button className="btn btn-danger mx-2" onClick={() => { makeRequest(user1Id, u.id) }}>Request</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AvailableFriends;