
import "./App.css";
import Login from "./components/user/login";
import Logout from "./components/user/logout";
import Register from "./components/user/register";
import MyProfile from "./components/user/myProfile";
import EditProfile from "./components/user/editProfile";
import AddUser from './components/user/addUser'
import AddArticle from "./components/post/add";
import Upload from "./components/post/upload";
import UpdatePost from "./components/post/update";
import Comment from "./components/comment/comment";
import Home from "./components/post/home";
import AdminHome from "./components/post/adminHome";
import UserList from "./components/user/userList";
import ProtectedRoutes from "./components/protectedroute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { UserContext } from "./components/user/UserContext";
import AvailableFriends from "./components/friend/availableFriends";
import Statistics from "./components/friend/statistics";

import EditImage from "./components/user/editImage";
import FriendsList from './components/friend/friendsList'

import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand
} from 'mdb-react-ui-kit';

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
          <>
            <img
              src="https://postnote-app.s3.amazonaws.com/images/8a7d03e98a9c9711975de3bca8ea7513"
              height='30'
              alt='PostNote logo'
              className="d-inline-block align-top"
            />
          </>
          <Navbar.Brand href="#home" className="menu">PostNote</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar>

              {/* <Nav.Link href="/add-article">Post</Nav.Link> */}
              {localStorage.getItem("token") ? (
                <Navbar className="mr-auto menu">
                  {localStorage.getItem("role") === 'ADMIN' ? (
                    <Nav.Link href="/adminHome">Home</Nav.Link>) :
                    (<Nav.Link href="/">Home</Nav.Link>)}
                  <Nav.Link href="/upload">Post</Nav.Link>
                  <Nav.Link href="/friendsList">Friends</Nav.Link>
                  <Nav.Link href="/add-friend">Add Friends</Nav.Link>
                  {localStorage.getItem("role") === 'ADMIN' ? (
                    <Nav.Link href="/addUser">Add User</Nav.Link>) :
                    (<></>)}
                  {localStorage.getItem("role") === 'ADMIN' ? (
                    <Nav.Link href="/userList">User List</Nav.Link>) :
                    (<></>)}
                  {localStorage.getItem("role") === 'ADMIN' ? (
                    <Nav.Link href="/statistics">Statistics</Nav.Link>) :
                    (<></>)}
                  <Nav.Link href="/my-profile">My Profile</Nav.Link>
                  <Nav.Link href="/logout">Logout</Nav.Link>
                  <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text className="dark">
                      Signed in as: {localStorage.getItem('username')}
                    </Navbar.Text>
                  </Navbar.Collapse>
                </Navbar>
              ) : (
                <Navbar className="mr-auto menu">
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/register">Register</Nav.Link>
                </Navbar>
              )}
            </Navbar>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/adminHome" element={<AdminHome />} />
            <Route exact path="/add-article" element={<AddArticle />} />
            <Route exact path="/upload" element={<Upload />} />
            <Route exact path="/logout" element={<Logout />} />
            <Route exact path="/add-friend" element={<AvailableFriends />} />
            <Route exact path="/friendsList" element={<FriendsList />} />
            <Route exact path="/my-profile" element={<MyProfile />} />
            <Route exact path="/edit-profile" element={<EditProfile />} />
            <Route exact path="/edit-image" element={<EditImage />} />
            <Route exact path="/update-post/:id" element={<UpdatePost />} />
            <Route exact path="/addUser" element={<AddUser />} />
            <Route exact path="/comments-of-post/:id" element={<Comment />} />
            <Route exact path="/userList" element={<UserList />} />
            <Route exact path="/statistics" element={<Statistics />} />
          </Route>
        </Routes>
      </UserContext.Provider>
      {/* </div> */}

    </Router>
  );
}

export default App;
