import React, { useState, useEffect } from 'react';
// import parse from 'html-react-parser'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.js';
// import '../App.css';
// import { UserContext, AuthContext } from "../components/UserContext";
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import moment from 'moment';


function UserList() {

    const [userList, setUserList] = useState([]);
    
    const deleteUser = (id) => {
        Axios.delete(`http://localhost:3001/api/delete/${id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response)=>{
            getUserList() 
        })
    }

    const getUserList = ()=>{
        Axios.get('http://localhost:3001/api/users', {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setUserList(response.data)
        }).catch((error)=>{
            var fail = document.getElementById('failAlert');
            var failMsg = document.getElementById('failAlertMsg');

            failMsg.innerText = error.response.data;
            fail.style.display = 'block';
        });
    }


    const closeFailAlert = () => {
            var failMessage = document.getElementById('failAlert');
            failMessage.style.display = 'none';
        }

    useEffect(() => {
        closeFailAlert();
        Axios.get('http://localhost:3001/api/users', {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setUserList(response.data)
        }).catch((error)=>{
            var fail = document.getElementById('failAlert');
            var failMsg = document.getElementById('failAlertMsg');

            failMsg.innerText = error.response.data;
            fail.style.display = 'block';
        });
    }, []);

    return (
        <div className="container my-5">
            <div className="alert alert-danger alert-dismissible fade show" role="alert" id="failAlert">
                <strong id="failAlertMsg">Error trying to get users.</strong>
                <button type="button" className="btn-close" onClick={closeFailAlert}></button>
            </div>
            <table className="table table-striped table-hover table-bordered border border-5 my-5" id="todos-table">
                <thead className="text-center">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => (
                        <tr key={user.id}>
                            <td className='text-center'>{user.firstname}</td>
                            <td className='text-center'>{user.lastname}</td>
                            <td className='text-center'>{user.username}</td>
                            <td className="text-center">
                                <a href={"/editUser/" + user.id} className="btn btn-secondary mx-2">Edit</a>
                                <button className="btn btn-danger mx-2" onClick={()=>{deleteUser(user.id)}}>Delete</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}

export default UserList;
