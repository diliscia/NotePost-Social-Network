import React, { useState, useEffect } from "react";
import "../../App.css";
import Axios from "axios";

function AvailableFriends() {
  const [availableFriends, setAvailableFriends] = useState([]);

  useEffect(() => {
      Axios.get(`http://localhost:3001/api/availableFriends`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
        .then((response) => {
          setAvailableFriends(response.data);
          console.log(response.data)
        })
        .catch((error) => {
          var failMessage = document.getElementById("fail-updated");
          failMessage.innerHTML = error.response.data;
        });
    }, []);

  const styles = {
    width: 300,
  };

  const getAvailableFriends = () => {
    Axios.get(`http://localhost:3001/api/availableFriends`, {
        headers: {
            "x-access-token": localStorage.getItem("token"),
        },
    }).then((response) => {
        console.log("getAvailableFriends")
        setAvailableFriends(response.data)
    })
}

const makeRequest = (user2Id) => {
    Axios.post(
        `http://localhost:3001/api/makeRequest/${user2Id}`, "data" , {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      ).then((response) => {
        console.log("makeRequest")
        getAvailableFriends()
      })
}
    const cancelRequest = (user2Id) => {
        Axios.delete(`http://localhost:3001/api/cancelRequest/${user2Id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            console.log("cancelRequest")
            getAvailableFriends();
        })
    }

    const confirmFriend = (user1Id) => {
        Axios.put(`http://localhost:3001/api/acceptRequest/${user1Id}`,  "data" , {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            console.log("confirmFriend")
            getAvailableFriends();
        })
    }

    const declineRequest = (user1Id) => {
        Axios.delete(`http://localhost:3001/api/declineRequest/${user1Id}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            console.log("cancelRequest")
            getAvailableFriends();
        })
    }

  return (
    <div className="container my-5">
      <h1 className="text-center my-5">Add new Friends</h1>
      {availableFriends.map((u) => (
        <div key={u.id} className="my-5 card p-3">
          {/* <div className="card"> */}
            <div className="card-body">
              <div>
                <img
                  style={styles}
                  src={"https://postnote-app.s3.amazonaws.com/" + u.userImage}
                  alt="user image"
                ></img>
                <h3 className="text mx-3">
                  {" "}
                  {u.firstname} {u.lastname}
                </h3>
                {
                (u.status === "PENDING" ? (u.user1Id !== u.userId ? <button className="btn btn-primary mx-2" id={u.id} onClick={() => {cancelRequest(u.userId)}}>CANCEL</button> : <div> <button className="btn btn-primary mx-2" id={u.id} onClick={() => {confirmFriend(u.userId)}}>CONFIRM</button> <button className="btn btn-primary mx-2" id={u.id} onClick={() => {declineRequest(u.userId)}}>DECLINE</button></div> ) : <button className="btn btn-primary mx-2" id={u.id} onClick={() => {makeRequest(u.userId)}}>REQUEST</button>)
            }
              </div>
            </div>
          {/* </div> */}
          <div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AvailableFriends;
