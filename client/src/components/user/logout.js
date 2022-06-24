
import { UserContext } from "./UserContext";
import { useContext } from "react";

function Logout() {
  const {user, setUser} = useContext(UserContext);
  localStorage.clear();
  setUser(null)
return (
  <div className="alert alert-success alert-dismissible fade show" role="alert" id="successAlert">
  <strong>You have been logged out succesfully</strong>
</div>
);
}

export default Logout;
