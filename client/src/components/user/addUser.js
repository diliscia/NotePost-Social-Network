import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function Register() {
  let navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "",
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
    const regexRole = /^[A-Za-z0-9]{4,50}$/g;

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

    if (!values.role.trim()) {
      errors.role = "Role is required!";
    } else if (!regexRole.test(values.role)) {
      errors.role =
        "Role must be ADMIN or NORMAL-USER.";
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
      Axios.post("http://localhost:3001/addUser", formValues)
        .then(() => {
          alert("Successfully added user!");
          navigate("/adminHome");
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

  return (
    <div className="container">
      <h1 className='text-center my-5'>Add a User</h1>
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
            User email
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
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <input
            type="text"
            className="form-control"
            id="role"
            name="role"
            placeholder="Role"
            max-length="20"
            value={formValues.role}
            onChange={handleChange}
          />
          <p className="text-danger"> {formErrors.role} </p>
        </div>

        <button className="btn btn-primary">Add User</button>
      </form>
    </div>
  );
}

export default Register;
