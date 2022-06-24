
import { UserContext } from "./UserContext";
import { useContext } from "react";

function Logout() {
  const {user, setUser} = useContext(UserContext);
  localStorage.clear();
  setUser(null)

}

export default Logout;
