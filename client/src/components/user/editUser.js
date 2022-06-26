import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
// import '../../App.css';
// import './user.css';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import { AuthContext, UserContext } from "../components/UserContext";
// import parse from 'html-react-parser'


function EditUser(){
    const { id } = useParams();
    let navigate = useNavigate();

    const initialValues = {
        userId: 0,
        firstname: "",
        lastname: "",
        username: "",
        role: "",
    }

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const closeSuccessAlert = () => {
        var successMessage = document.getElementById('successAlert');
        successMessage.style.display = 'none';
    }
    const closeFailAlert = () => {
        var failMessage = document.getElementById('failAlert');
        failMessage.style.display = 'none';
    }

    // useEffect(() => {
    //     Axios.get(`http://localhost:3001/editUser/${id}`, {
    //                 headers: {
    //                     "x-access-token": localStorage.getItem("token"),
    //                 },
    //             }).then((response) => {
    //         console.log(response);
    //         setFormValues(response.data[0]);
    //      }).catch((error)=>{
    //         console.log(error);
    //     });
    // },[]);
  
    useEffect(() => {
        Axios.get(`http://localhost:3001/editUser/${id}`,{
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }).then((response) => {
            console.log(response.data[0])
            setFormValues(response.data[0]);
          })
          .catch((error) => {
            // var failMessage = document.getElementById("fail-updated");
            // failMessage.innerHTML = error.response.data;
          });
      }, []);

    useEffect (()=>{
        closeFailAlert();
        closeSuccessAlert();
        if(Object.keys(formErrors).length === 0 && isSubmit === true && localStorage.getItem("token")){
            Axios.put(`http://localhost:3001/editUser/${id}`, formValues, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            })
            .then(()=>{
                var successMessage = document.getElementById('successAlert');
                successMessage.style.display = 'block';
            })
            .catch((error)=>{
                console.log(error);
                var fail = document.getElementById('failAlert');
                var failMsg = document.getElementById('failAlertMsg');
    
                failMsg.innerText = error.response.data;
                fail.style.display = 'block';
            });
        }
    }, [formErrors, isSubmit]);

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        closeFailAlert();
        closeSuccessAlert();
        setFormErrors(validate(formValues));
        if(localStorage.getItem("token")){
            setIsSubmit(true);
        }
        else {
            navigate("/login");
        }
    };

    const validate = (values) => {
        const errors = {};
        const regexFirstName = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
        const regexLastName = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
        const regexUsername = /^[A-Za-z0-9]{4,50}$/g;
    
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
    
        if (!values.role.trim()) {
          errors.role = "Role is required!";
        }
    
        return errors;
      };


    return (
        <div className='container my-5'> 
            <div className="alert alert-success alert-dismissible fade show" role="alert" id="successAlert">
                <strong>The user has been updated successfully</strong>
                <button type="button" className="btn-close" onClick={closeSuccessAlert}></button>
            </div> 
            <div className="alert alert-danger alert-dismissible fade show " role="alert" id="failAlert">
                <strong id="failAlertMsg">Error while trying to update the user. Please try again.</strong>
                <button type="button" className="btn-close" onClick={closeFailAlert}></button>
            </div>
            <h1 className='text-center'>Edit User</h1>
            <form  onSubmit={handleSubmit}>
                <div className="containerUser">
                    <div className="mb-3 text-center">

                        <label htmlFor="firstname" className='form-label my-3 mb-1'>First name: </label>
                        <input type="text" className="form-control" 
                            name="firstname" id="firstname" value={formValues.firstname} onChange={handleChange}/>
                        <p className="text-danger">{formErrors.firstname}</p>

                        <label htmlFor="lastname" className='form-label my-3 mb-1'>Last name: </label>
                        <input type="text" className="form-control" 
                            name="lastname" id="lastname" value={formValues.lastname} onChange={handleChange}/>
                        <p className="text-danger">{formErrors.lastname}</p>

                        <label htmlFor="username" className='form-label my-3 mb-1'>User name: </label>
                        <input type="text" className="form-control" 
                            name="username" id="username" value={formValues.username} onChange={handleChange}/>
                        <p className="text-danger">{formErrors.username}</p>

                        <div className="mb-3">
                            <p> Role: {formValues.role}</p>
                            <label htmlFor="role" className="form-label mx-2">
                                ADMIN:
                            </label>
                            <input type="radio" name="role" value="ADMIN" onChange={handleChange}/>
                            <label htmlFor="role" className="form-label mx-2">
                                NORMAL-USER:
                            </label>
                            <input type="radio" name="role" value="NORMAL-USER" onChange={handleChange}/>
                            <p className="text-danger"> {formErrors.role} </p>
                        </div>

                        <div className='d-flex justify-content-center'>
                            <button className="btn btn-primary text-center my-3 mx-1" type="submit">Save Changes</button>
                            <a href="/my-profile" className="btn btn-primary text-center my-3 mx-1" type="submit">Back to My Profile</a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditUser;