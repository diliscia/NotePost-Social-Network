import { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";

function Comment() {
  const { id } = useParams();
  const initialValues = {
    postText: "",
    postImage: [],
  };

  const [post, setPost] = useState(initialValues);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [commentList, setCommentList] = useState([]);

  const stylesimagepost = {
    width: 2000,
  };

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/update-post/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => {
        setPost(response.data[0]);
      })
      .catch((error) => {
        var failMessage = document.getElementById("fail-updated");
        failMessage.innerHTML = error.response.data;
      });

    Axios.get(`http://localhost:3001/api/comment/listcomments/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => {
        setCommentList(response.data);
      })
      .catch((error) => {
        console.log(error);
        var failMessage = document.getElementById("fail-updated");
        failMessage.innerHTML = error.response.data;
      });
  }, []);

  const profilepicture = {
    width: 50,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.comment) {
      errors.comment = "Comment is required!";
    } else if (values.comment.length < 10 || values.comment.length > 100) {
      errors.comment =
        "Comment must be at least 10 characters and less than 100 characters long";
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      addComment(formValues);
    }
  }, [formErrors]);

  const addComment = (formValues) => {
    Axios.post(
      `http://localhost:3001/api/comment/addcomment/${id}`,
      { formValues },
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    )
      .then(() => {
        alert("Successfully added!");
        getCommentList()
      })
      .catch((error) => {
        console.log(error)
        var failMessage = document.getElementById("fail-added");
        failMessage.innerHTML = error.response.data;
      });
  };

  function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return (
      date.getMonth() +
      1 +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear() +
      " at " +
      strTime
    );
  }

  const getCommentList = () => {
    Axios.get(`http://localhost:3001/api/comment/listcomments/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => {
        setCommentList(response.data);
      })
      .catch((error) => {
        console.log(error);
        var failMessage = document.getElementById("fail-updated");
        failMessage.innerHTML = error.response.data;
      });
  }

  return (
    <div className="containerComm">
      <div className="card mt-4">
        <div className="card-body">
          <div className="d-inline align-top">
            <img
              className="photo rounded-circle"
              style={profilepicture}
              src={"https://postnote-app.s3.amazonaws.com/" + post.userImage}
            ></img>
            <h6 className="card-subtitle d-inline">
              {post.firstname} {post.lastname}
            </h6>
            <p className="">
              {formatDate(new Date(Date.parse(post.createdAt)))}
            </p>
            <h5 className="card-text">{post.postText}</h5>
          </div>
        </div>
        <div className=" container">
          {post.postImage === null ? (
            ""
          ) : (
            <img
              className="img-fluid mb-3"
              style={stylesimagepost}
              src={"https://postnote-app.s3.amazonaws.com/" + post.postImage}
            />
          )}
        </div>
        <div className="card-body">
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mt-3">
                <textarea
                  type="text"
                  className="form-control container"
                  id="comment"
                  name="comment"
                  placeholder="Write a comment..."
                  rows="4"
                  cols="50"
                  value={formValues.comment}
                  onChange={handleChange}
                ></textarea>
                <p className="text-danger">{formErrors.comment}</p>
              </div>
              <div className="text-center">
              <button className="btn btn-primary">Add comment</button>
              </div>
            </form>
            {commentList.map((value, key) => {
              return (
                <div key={value.id} className="card mt-3">
                  <div className="card-body">
                    <div className="d-inline align-top">
                      <img
                        className="photo rounded-circle"
                        style={profilepicture}
                        src={
                          "https://postnote-app.s3.amazonaws.com/" +
                          value.userImage
                        }
                      ></img>
                    </div>
                    <h6 className="card-subtitle d-inline">
                      {value.firstname} {value.lastname}
                    </h6>
                    <p className="">
                      {formatDate(new Date(Date.parse(value.createdAt)))}
                    </p>
                    <h5 className="card-text">{value.postText}</h5>
                    <p>{value.commentText}</p>
                    <a
                      className="btn btn-secondary"
                      href={"/update-comment/" + value.id}
                    >
                      Edit
                    </a>
                    <span> </span>
                    {/* <a className="btn btn-danger" href="#" onClick={()=>{deleteComment(commentList.id)}}>Delete</a> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
