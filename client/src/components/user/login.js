import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function Login() {
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  Axios.defaults.withCredentials = true;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values) => {
    const errors = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,50}$/i;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,100}$/i;

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

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      Axios.post("http://localhost:3001/login", formValues)
        .then((response) => {
          if (!response.data.auth) {
            var failMessage = document.getElementById("fail-added");
            failMessage.innerHTML = response.data.message
          } else {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.result[0].username)
            localStorage.setItem("id", response.data.result[0].id)
            setUser(response.data.result[0].username) 
            navigate("/");
          }
        })
        .catch((error) => {
          var failMessage = document.getElementById("fail-added");
          if (error.response.status === 204) {
            failMessage.innerHTML = "Unable to find the user";
          } else if (error.response.status === 500) {
            failMessage.innerHTML = "Server error! Login failed";
          } else if (error.response.status === 404) {
            failMessage.innerHTML = "Server error! Could not find the user";
          } else {
            failMessage.innerHTML = "Server error!"
          }
        });
    }
  }, [formErrors]);

  return (
    <div className="container">
      <div id="fail-added" className="text-danger"></div>
      <h1 className='text-center my-5'>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button className="btn btn-primary">Log in</button>
        <p>
          Do not have an account. Register <a href="/register">here</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
