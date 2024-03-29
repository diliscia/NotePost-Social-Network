import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import './user.css';

function Register() {
  let navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values) => {
    const errors = {};
    const regexFirstName = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexLastName = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexUsername = /^[A-Za-z0-9]{4,50}$/g;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,50}$/i;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,100}$/i;

    if (!values.firstname) {
      errors.firstname = "First name is required";
    } else if (!regexFirstName.test(values.firstname)) {
      errors.firstname =
        "First name can only contains letters and must be between 1-50 characters.";
    }

    if (!values.lastname) {
      errors.lastname = "Last name is required";
    } else if (!regexLastName.test(values.lastname)) {
      errors.lastname =
        "Last name can only contains letters and must be between 1-50 characters.";
    }

    if (!values.username.trim()) {
      errors.username = "Username is required!";
    } else if (!regexUsername.test(values.username)) {
      errors.username =
        "Username can contains lowercase and uppercase letters and numbers. And must be between 4-50 characters.";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regexEmail.test(values.email)) {
      errors.email = "Email address is invalid";
    } else if (values.email.length > 50) {
      errors.email = "Email cannot be more than 50 characters";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (!regexPassword.test(values.password)) {
      errors.password =
        "Password must be at least 6 " +
        "characters long and must contain at least one uppercase letter, one lower case letter, and one number. It must not be longer than 100 characters";
    }

    if (!values.password2) {
      errors.password2 = "Password is required!";
    } else if (values.password2 !== values.password) {
      errors.password2 = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    closeFailAlert();
    closeSuccessAlert();
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      Axios.post("http://localhost:3001/register", formValues)
        .then(() => {
          // alert("Successfully register!");
          var successMessage = document.getElementById('successAlert');
          successMessage.style.display = 'block';
          // navigate("/login");
        })
        .catch((error) => {
          var failMessage = document.getElementById("fail-added");
          if (error.response.status === 400) {
            failMessage.innerHTML =
              "Email " +
              formValues.email +
              " is already exist in the system. Please choose sign in";
          } else if (error.response.status === 500) {
            failMessage.innerHTML = "Server error! Register failed";
          } else if (error.response.status === 404) {
            failMessage.innerHTML = "Server error! Not found";
          } else {
            failMessage.innerHTML = "Server error!";
          }
        });
    }
  }, [formErrors]);

  const closeSuccessAlert = () => {
    var successMessage = document.getElementById('successAlert');
    successMessage.style.display = 'none';
    }
    const closeFailAlert = () => {
        var failMessage = document.getElementById('failAlert');
        failMessage.style.display = 'none';
    }
  return (
    <div className="containerUser">
        <div className="alert alert-success alert-dismissible fade show" role="alert" id="successAlert">
            <strong>You have registered successfully</strong>
            <button type="button" className="btn-close" onClick={closeSuccessAlert}></button>
        </div> 
        <div className="alert alert-danger alert-dismissible fade show" role="alert" id="failAlert">
            <strong id="failAlertMsg">Error while trying to register. Please try again.</strong>
            <button type="button" className="btn-close" onClick={closeFailAlert}></button>
        </div>
      <h1 className='text-center my-5'>Registration</h1>
      <div id="fail-added" className="text-danger"></div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">
            First name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstname"
            name="firstname"
            placeholder="First name"
            max-length="20"
            value={formValues.firstname}
            onChange={handleChange}
          />
          <p className="text-danger"> {formErrors.firstname} </p>
        </div>
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">
            Last name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastname"
            name="lastname"
            placeholder="Last name"
            max-length="50"
            value={formValues.lastname}
            onChange={handleChange}
          />
          <p className="text-danger"> {formErrors.lastname} </p>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Desired username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            placeholder="user.name"
            max-length="50"
            value={formValues.username}
            onChange={handleChange}
          />
          <p className="text-danger"> {formErrors.username} </p>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Your email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            max-length="50"
            placeholder="d@gmail.com"
            value={formValues.email}
            onChange={handleChange}
          />
          <p className="text-danger">{formErrors.email}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
           New Password
          </label>
          <input
            type="password"
            className="form-control "
            id="password"
            name="password"
            max-length="100"
            placeholder="uppercase,lowercase,number,6-100chars"
            value={formValues.password}
            onChange={handleChange}
          />
          <p className="text-danger">{formErrors.password}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="password2" className="form-label">
            Password (repeat)
          </label>
          <input
            type="password"
            className="form-control "
            id="password2"
            name="password2"
            placeholder="confirm_your_password"
            max-length="100"
            value={formValues.password2}
            onChange={handleChange}
          />
          <p className="text-danger">{formErrors.password2}</p>
        </div>

        <button className="btn btn-primary">Sign Up</button>
        <p>
          Already have an account? Login <a href="/login">here</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
