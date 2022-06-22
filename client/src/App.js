import "./App.css";
import Login from "./components/user/login";
import Logout from "./components/user/logout";
import Register from "./components/user/register";
import AddArticle from "./components/post/add";
import Upload from "./components/post/upload";
import UpdatePost from "./components/post/update";
import Home from "./components/post/home";
import ProtectedRoutes from "./components/protectedroute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { UserContext } from "./components/user/UserContext";
import AvailableFriends from "./components/friend/AvailableFriends";
import MyProfile from "./components/user/myProfile";
import EditProfile from "./components/user/editProfile";
import EditImage from "./components/user/editImage";
import FriendsList from './components/friend/friendsList'

function App() {

  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setUser(localStorage.getItem('username'))
    }
  }, [user]);

  return (
    <Router>
      {/* <div className="container"> */}
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">PostNote</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar>

                  {/* <Nav.Link href="/add-article">Post</Nav.Link> */}
                {localStorage.getItem("token") ? (
                  <Navbar className="mr-auto">
                      <Nav.Link href="/">Home</Nav.Link>
                      <Nav.Link href="/my-profile">My Profile</Nav.Link>
                      <Nav.Link href="/add-friend">Add Friend</Nav.Link>
                      <Nav.Link href="/friendsList">Friends</Nav.Link>
                      <Nav.Link href="/upload">Post</Nav.Link>
                      <Nav.Link href="/logout">Logout</Nav.Link>

                    <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                      Signed in as: {localStorage.getItem('username')}
                    </Navbar.Text>
                    </Navbar.Collapse>
                    </Navbar>
                ) : (
                  <Navbar className="mr-auto">
                      <Nav.Link href="/login">Login</Nav.Link>
                      <Nav.Link href="/register">Register</Nav.Link>
                  </Navbar>
                )}
              </Navbar>
            </Navbar.Collapse>
          </Container>
        </Navbar>
  {/* <Navbar bg="light" expand="lg">
  <Container>
  <Navbar.Brand href="#home">PostNote</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>
        Signed in as: <a href="#login">Mark Otto</a>
      </Navbar.Text>
    </Navbar.Collapse>
  </Container>
</Navbar> */}
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/add-article" element={<AddArticle />} />
              <Route exact path="/upload" element={<Upload />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/add-friend" element={<AvailableFriends />} />
              <Route exact path="/friendsList" element={<FriendsList />} />
              <Route exact path="/my-profile" element={<MyProfile />} />
              <Route exact path="/edit-profile" element={<EditProfile />} />
              <Route exact path="/edit-image" element={<EditImage />} />
              <Route exact path="/update-post/:id" element={<UpdatePost />} />
            </Route>
          </Routes>
        </UserContext.Provider>
      {/* </div> */}
      
    </Router>
  );
}

export default App;
