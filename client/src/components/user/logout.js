
import { UserContext } from "./UserContext";
import { useContext } from "react";

function Logout() {
  const {user, setUser} = useContext(UserContext);
  localStorage.clear();
  setUser(null);
  console.log(user)
  // setUser("")
 
//   const closeSuccessAlert = () => {
//     var successMessage = document.getElementById('successAlert');
//     successMessage.style.display = 'none';
// }

// const closeFailAlert = () => {
//     var failMessage = document.getElementById('failAlert');
//     failMessage.style.display = 'none';
// }

// return

  // <div className="container">
  // <div className="alert alert-success alert-dismissible fade show text-center" role="alert" id="successAlert">
  // <strong>You logged out successfully</strong>
  // <button type="button" className="btn-close" onClick={closeSuccessAlert}></button>
  // </div> 
  // </div> 
// );
}

export default Logout;
