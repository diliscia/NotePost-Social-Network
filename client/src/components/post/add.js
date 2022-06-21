import { useState } from 'react'
import Axios from "axios";

export default function AddArticle() {
  const [file, setFile] = useState()
  const [description, setDescription] = useState("")

  const submit = async event => {
    event.preventDefault()

    const formData = new FormData()
    formData.append("image", file)
    formData.append("description", description)
  
    const result = await Axios.post("http://localhost:3001/images", formData, { headers: {'Content-Type': 'multipart/form-data'}})
    console.log(result.data)
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input
          filename={file} 
          onChange={e => setFile(e.target.files[0])} 
          type="file" 
          accept="images/*"
        ></input>
        <input
          onChange={e => setDescription(e.target.value)} 
          type="text"
        ></input>
        <button type="submit">Submit</button>
      </form>

      <img src="http://localhost:3001/images/00f174f887a0f04ef768ad69617967eb"></img>
    </div>

    
  )
}