import { useEffect, useState } from "react";
import Axios from "axios";
import {useNavigate } from "react-router-dom";

function Upload() {
  let navigate = useNavigate();
  const initialValues = {
    profileImage:[],
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [file, setFile] = useState()

  const handleFileChange = (e) => {
    formValues['profileImage'] = e.target.files[0]
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  const [profile, setProfile] = useState([]);
  // const id = localStorage.getItem('id')

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/profile`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response);
        setProfile(response.data[0]);
      })
      .catch((error) => {
        navigate("/");
      });
  }, []);

  const styles = {
    width: 400,
  };

  const validate = (values) => {
    const errors = {};
    console.log(values)
    
    if (values.profileImage.length === 0) {
      return errors;
    } else { 
      if (!values.profileImage.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        errors.profileImage = "Invalid file";
      }
      if (values.profileImage.size > 1000000) {
        errors.profileImage = "You cannot upload file that larger than 1MB";
      }

    }
    return errors;
  };

  useEffect(() => {
    closeFailAlert();
    closeSuccessAlert();
    if (Object.keys(formErrors).length === 0 && isSubmit && (formValues.profileImage.length !== 0)) {
      addPost(formValues);
    }
    if (
        Object.keys(formErrors).length === 0 &&
        isSubmit && (formValues.profileImage.length === 0)
      ) {
        navigate('/my-profile');
      }
  }, [formErrors]);

  const addPost = (formValues) => {
    const formData = new FormData()
    formData.append("image", formValues.profileImage)
    formData.append("description", "my profile picture")

 
    Axios.post("http://localhost:3001/images", formData).then((response) => {
      const key = response.data.imagePath
    Axios.put("http://localhost:3001/uploadProfilePicture", {image: key}, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then(() => {
      // alert("Successfully added!");
      // navigate("/");
      var successMessage = document.getElementById('successAlert');
      successMessage.style.display = 'block';
    })
    .catch((error) => {
      // var failMessage = document.getElementById("fail-added");
      // failMessage.innerHTML = error.response.data;
      var fail = document.getElementById('failAlert');
      var failMsg = document.getElementById('failAlertMsg');

      failMsg.innerText = error.response.data;
      fail.style.display = 'block';
      
    });
  })
  };

  const closeSuccessAlert = () => {
    var successMessage = document.getElementById('successAlert');
    successMessage.style.display = 'none';
    }
    const closeFailAlert = () => {
        var failMessage = document.getElementById('failAlert');
        failMessage.style.display = 'none';
    }

  return (
    <div className='container my-5'> 
        <div className="alert alert-success alert-dismissible fade show" role="alert" id="successAlert">
            <strong>You Image has been updated successfully</strong>
            <button type="button" className="btn-close" onClick={closeSuccessAlert}></button>
        </div> 
        <div className="alert alert-danger alert-dismissible fade show" role="alert" id="failAlert">
            <strong id="failAlertMsg">Error while trying to update your Image. Please try again.</strong>
            <button type="button" className="btn-close" onClick={closeFailAlert}></button>
        </div>
        <h1 className='text-center'>Edit your Image</h1>
        <form className='m-4 w-75 mx-auto' onSubmit={handleSubmit}>
            <div className="mb-3 text-center">
            <img
                className="photo img-fluid "
                style={styles}
                src={"https://postnote-app.s3.amazonaws.com/"+ profile.userImage}
            ></img>
        </div>
        <div className="mb-3 text-center">
          <input 
          filename={file} 
            onChange={handleFileChange}
          type="file" 
          accept="image/*"
        ></input>
         <div id="image-error" className="text-danger"></div>
          <p className="text-danger"> {formErrors.profileImage} </p>
        </div>
        <div className='text-center'>
            <button className="btn btn-primary">Upload Image</button>
            <a href="/my-profile" className="btn btn-primary text-center my-3 mx-1" type="submit">Back to My Profile</a>
        </div>
        </form>
    </div>
  );
}

export default Upload;