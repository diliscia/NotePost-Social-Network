import { useEffect, useState } from "react";
import Axios from "axios";
import {useNavigate } from "react-router-dom";

function Upload() {
  let navigate = useNavigate();
  const initialValues = {
    postText: "",
    postImage:[],
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [file, setFile] = useState()

  const handleFileChange = (e) => {
    formValues['postImage'] = e.target.files[0]
    // const image = e.target.files[0];
    // var imageValidation = document.getElementById("image-error");
    // imageValidation.innerHTML = ""

    // if (image.size > 100000) {
    //   imageValidation.innerHTML = "You cannot upload file that larger than 1MB";
    //   return false;
    // }

    // if (!image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
    //   imageValidation.innerHTML = "Please select an image";
    //   return false;
    // }

  }

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
    if (!values.postText) {
      errors.postText = "Content is required!";
    } else if (values.postText.length < 1 || values.postText.length > 500) {
      errors.postText = "Content must be at least 1 characters and less than 500 characters long";
    } 
    
    if (values.postImage.length === 0) {
      errors.postImage ="Image is required!"
    } else if (!values.postImage.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      errors.postImage = "Invalid file";
    }
    if (values.postImage.size > 1000000) {
      errors.postImage = "You cannot upload file that larger than 1MB";
    }
    
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      addPost(formValues);
    }
  }, [formErrors]);

  const addPost = (formValues) => {
    const formData = new FormData()
    formData.append("image", formValues.postImage)
    formData.append("description", formValues.postText)
 
    Axios.post("http://localhost:3001/images", formData).then((response) => {
      const key = response.data.imagePath
    Axios.post("http://localhost:3001/upload", {postText: formValues.postText, image: key}, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then(() => {
      alert("Successfully added!");
      navigate("/");
    })
    .catch((error) => {
      var failMessage = document.getElementById("fail-added");
      failMessage.innerHTML = error.response.data;
    });
  })
  };

  return (
    <div className="container">
      <div id="fail-added" className="text-danger"></div>
      <form onSubmit={handleSubmit}>
        <div className="mt-3">
          <textarea
            type="text"
            className="form-control"
            id="postText"
            name="postText"
            placeholder="What is in your mind?"
            rows="4" cols="50"
            value={formValues.postText}
            onChange={handleChange}
          ></textarea>
          <p className="text-danger">{formErrors.postText}</p>
        </div>
        <div className="mb-3">
          <input 
          filename={file} 
            onChange={handleFileChange}
          type="file" 
          accept="image/*"
        ></input>
         <div id="image-error" className="text-danger"></div>
          <p className="text-danger"> {formErrors.postImage} </p>
        </div>
        <button className="btn btn-primary">Post</button>
      </form>
    </div>
  );
}

export default Upload;