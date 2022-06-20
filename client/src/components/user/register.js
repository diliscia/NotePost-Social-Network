import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function Register() {
  let navigate = useNavigate();

  const [formValues, setFormValues] = useState({
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
    const regexUsername = /^[a-z0-9]{4,20}$/g;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,100}$/i;

    if (!values.username.trim()) {
      errors.username = "Username is required!";
    } else if (!regexUsername.test(values.username)) {
      errors.username =
        "Username can only contains lowercase letters and numbers. And must be between 4-20 characters.";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regexEmail.test(values.email)) {
      errors.email = "Email address is invalid";
    } else if (values.email.length > 320) {
      errors.email = "Email cannot be more than 320 characters";
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
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      Axios.post("http://localhost:3001/register",formValues)
        .then(() => {
          alert("Successfully register!");
          navigate("/login");
        })
        .catch((error) => {
          var failMessage = document.getElementById("fail-added");
          if (error.response.status === 400 ) { 
            failMessage.innerHTML = "Username " + formValues.username + " is already exist in the system. Please choose another username";
          } else if (error.response.status === 500){
            failMessage.innerHTML = "Server error! Register failed";
          } else if (error.response.status === 404) {
            failMessage.innerHTML = "Server error! Not found"
          } else {
            failMessage.innerHTML = "Server error!"
          }
        });
    }
  }, [formErrors]);

  return (
    <div className="container">
      <h1>Registration</h1>
      <div id="fail-added" className="text-danger"></div>
      <form onSubmit={handleSubmit}>
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
            placeholder="d@gmail.com"
            value={formValues.email}
            onChange={handleChange}
          />
          <p className="text-danger">{formErrors.email}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control "
            id="password"
            name="password"
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
