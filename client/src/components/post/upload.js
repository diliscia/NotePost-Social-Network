import React, {useState} from 'react'
import Axios from "axios";

function Upload() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("")
  const [image, setImage] = useState([]);
  const [file, setFile] = useState()

  const submit = (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append("image", image)
    formData.append("description", description)
  
   Axios.post("http://localhost:3001/images", formData, { headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
    console.log("Here is the response")
    console.log(response)
    const key = response.data.imagePath
    console.log("Here is the key")
    console.log(key)
    Axios.post("http://localhost:3001/upload", {title: title, description:description, image: key}, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
  })
}



  return (
    <div className="container">
      <h1>Create a post</h1>
      <div id="fail-added" className="text-danger"></div>
      <form> 
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            placeholder="Title ..."
            max-length="20"
            onChange = {(event) => {
              setTitle(event.target.value)
            }}
            // value={formValues.firstname}
            // onChange={handleChange}
          />
          {/* <p className="text-danger"> {formErrors.firstname} </p> */}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            placeholder="Description ..."
            max-length="50"
            onChange = {(event) => {
              setDescription(event.target.value)
            }}
            // value={formValues.lastname}
            // onChange={handleChange}
          />
          </div>
           <div className="mb-3">
          <input 
          filename={file} 
          onChange={e => setImage(e.target.files[0])} 
          type="file" 
          accept="image/*"
        ></input>
          {/* <p className="text-danger"> {formErrors.lastname} </p> */}
        </div>

        {/* <button className="btn btn-primary">Sign Up</button> */}

        <button onClick = {submit}> upload</button>
      
      </form>
    </div>
  )
}

export default Upload
