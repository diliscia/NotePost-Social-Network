import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function Statistics() {
    const [postsByDate, setPostsByDate] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/postsByDate`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })
            .then((response) => {
                setPostsByDate(response.data);
            })
    }, []);

    function formatDate(date) {
        return (date.getFullYear() +"-" +date.getMonth()+"-" +date.getDate());
    }

    return (
        <div className="container my-5">
            <table className="table table-striped table-hover table-bordered border border-5 my-5" id="posts-table">
                <thead className="text-center">
                    <tr>
                        <th>Date</th>
                        <th>Count of posts</th>
                    </tr>
                </thead>
                <tbody>
                    {postsByDate.map((data) => (
                        <tr >
                            <td className='text-center'>{formatDate(new Date(data.day))}</td>
                            <td className='text-center'>{data.c}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Statistics;