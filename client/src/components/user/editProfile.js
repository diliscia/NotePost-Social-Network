import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../../App.css';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import { AuthContext, UserContext } from "../components/UserContext";
// import parse from 'html-react-parser'


function EditProfile(){
    const { id } = useParams();
    let navigate = useNavigate();

    const initialValues = {
        firstname: "",
        lastname: "",
        username: "",
    }

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect (()=>{
        Axios.get(`http://localhost:3001/user/${id}`)
        .then((response)=>{
            console.log(response);
            setFormValues(response.data[0]);
        }).catch((error)=>{
            navigate("/");
        });
    },[]);

    useEffect (()=>{
        if(Object.keys(formErrors).length === 0 && isSubmit && localStorage.getItem("token")){
            Axios.put(`http://localhost:3001/user/${id}`, formValues, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            })
            .then(()=>{
                var successMessage = document.getElementById('successAlert');
                successMessage.style.display = 'block';
            })
            .catch((error)=>{
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
        setFormErrors(validateForm(formValues));
        if(localStorage.getItem("token")){
            setIsSubmit(true);
        }
        else {
            navigate("/login");
        }
    };

    const closeSuccessAlert = () => {
        var successMessage = document.getElementById('successAlert');
        successMessage.style.display = 'none';
    }
    const closeFailAlert = () => {
        var failMessage = document.getElementById('failAlert');
        failMessage.style.display = 'none';
    }

    const validateForm = (values) => {
        const errors = {}
    
        if (!values.firstname){
            errors.firstname = "Task is required";
        }
        else if (values.firstname.length < 1 || values.firstname.length > 100){
            errors.firstname = "Firstname should be between 1 to 100 characters"
        }

        if (!values.lastname){
            errors.lastname = "Task is required";
        }
        else if (values.lastname.length < 1 || values.lastname.length > 100){
            errors.firstname = "Lastnama should be between 1 to 100 characters"
        }

        if (!values.username){
            errors.username = "Task is required";
        }
        else if (values.username.length < 1 || values.username.length > 100){
            errors.username = "Username should be between 1 to 100 characters"
        }

        return errors;
    };

    return (
        <div className='container my-5'> 
            <div className="alert alert-success alert-dismissible fade show" role="alert" id="successAlert">
                <strong>You Profile has been updated successfully</strong>
                <button type="button" className="btn-close" onClick={closeSuccessAlert}></button>
            </div> 
            <div className="alert alert-danger alert-dismissible fade show" role="alert" id="failAlert">
                <strong id="failAlertMsg">Error while trying to update your profile. Please try again.</strong>
                <button type="button" className="btn-close" onClick={closeFailAlert}></button>
            </div>
            <h1 className='text-center'>Edit your Profile</h1>
            <form className='m-4 w-75 mx-auto' onSubmit={handleSubmit}>
                <label htmlFor="firstname" className='form-label my-3 mb-1'>firstname</label>
                <input type="text" className="form-control" 
                    name="firstname" id="firstname" value={formValues.task} onChange={handleChange}/>
                <p className='errors'>{formErrors.firstname}</p>

                <label htmlFor="lastname" className='form-label my-3 mb-1'>lastname</label>
                <input type="text" className="form-control" 
                    name="lastname" id="lastname" value={formValues.last} onChange={handleChange}/>
                <p className='errors'>{formErrors.lastname}</p>

                <label htmlFor="username" className='form-label my-3 mb-1'>username</label>
                <input type="text" className="form-control" 
                    name="username" id="username" value={formValues.task}username onChange={handleChange}/>
                <p className='errors'>{formErrors.username}</p>



                <div className='d-flex justify-content-center'>
                    <button className="btn btn-primary text-center my-3 mx-1" type="submit">Save Changes</button>
                    <a href="/my-profile" className="btn btn-primary text-center my-3 mx-1" type="submit">Back to My Profile</a>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;