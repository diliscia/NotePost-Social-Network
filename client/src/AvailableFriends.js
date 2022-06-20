import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../App.css';
import Axios from 'axios';

function AvailableFriends() {
    const [user1Id, setUser1Id] = useState(0);
    const [availableFriends, setAvailableFriends] = useState([]);

    const makeRequest = (user1Id, user2Id) => {
        Axios.post(`http://localhost:3001/api/makeFriendship/${user1Id}/${user2Id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response)=>{
            getAvailableFriendsList();
        })
        
    }

    const getAvailableFriendsList = () => {
        useEffect(() => {
            if (!localStorage.getItem("token")) {
                setUser1Id(localStorage.getItem('id'))
                Axios.get(`http://localhost:3001/api/availableFriends/${user1Id}`, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }).then((response) => {
                    setAvailableFriends(response.data)
                })
            }
        }, []);
    }

    return (
        <div className="container my-5">
            <h1 className="text-center my-5 text-success">Available users That you can request Friendship</h1>
            {availableFriends.map((user) => (
                <div key={user.id} className="my-5 card p-3">
                    <image src={user.userImage} alt='user image'></image>
                    <h3 className=' text-primary'>{user.firstname}</h3>
                    <p><i>{user.lastname} </i></p>
                    <div>
                        <button className="btn btn-danger mx-2" onClick={() => { makeRequest(user1Id, user.id) }}>Request</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default AvailableFriends;