import React, { useState, useEffect } from "react";
import "../../App.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function FriendsList() {
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/friendsList`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log(response.data);
      setFriendsList(response.data);
    });
  }, []);

  const styles = {
    height: 150,
  };

  const cancelRequest = (user2Id) => {
    Axios.delete(`http://localhost:3001/api/cancelRequest/${user2Id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log("cancelRequest");
      getFriendList();
    });
  };

  const declineRequest = (user1Id) => {
    Axios.delete(`http://localhost:3001/api/declineRequest/${user1Id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log("cancelRequest");
      getFriendList();
    });
  };

  const getFriendList = () => {
    Axios.get(`http://localhost:3001/api/friendsList`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log(response.data);
      setFriendsList(response.data);
    });
  };

  return (
    <div className="container my-5">
      <h1 className="text-center my-5">Your Friends</h1>
      {friendsList.map((u) => (
        <div key={u.id} className="my-5 card p-3">
          <div className="card">
            <div className="card-body">
              <div>
                <img
                  style={styles}
                  src={"https://postnote-app.s3.amazonaws.com/" + u.userImage}
                  alt="user image"
                ></img>
                <h3 className="text mx-3">
                  {" "}
                  {u.firstname} {u.lastname} {u.friendId}
                </h3>
                {u.user1Id === u.friendId ? (
                  <button
                    className="btn btn-primary mx-2"
                    onClick={() => {
                      declineRequest(u.friendId);
                    }}
                  >
                    UNFRIEND
                  </button>
                ) : (
                  <button
                    className="btn btn-primary mx-2"
                    onClick={() => {
                      cancelRequest(u.friendId);
                    }}
                  >
                    UNFRIEND
                  </button>
                )}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      ))}
    </div>
  );
}

export default FriendsList;
