import "./App.css";
import Login from "./components/user/login";
import Logout from "./components/user/logout";
import Register from "./components/user/register";
import AddArticle from "./components/post/add";
import ProtectedRoutes from "./components/protectedroute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { UserContext } from "./components/user/UserContext";
import AvailableFriends from "./components/friend/availableFriends";
import MyProfile from "./components/user/myProfile";

function App() {

  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setUser(localStorage.getItem('username'))
    }
  }, [user]);

  return (
    <Router>
      <div className="containter">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">PostNote</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav className="mr-auto">
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/add-article">
                  <Nav.Link>Post</Nav.Link>
                </LinkContainer>
                {localStorage.getItem("token") ? (
                  <div className="border-start border-4 border-success">
                    <Navbar.Text className="ps-2">
                      Signed in as: {localStorage.getItem('username')}
                    </Navbar.Text>
                    <LinkContainer to="/my-profile" className="ps-2 mt-1">
                      <Nav.Link>My Profile</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/add-friend" className="ps-2">
                      <Nav.Link>Add Friend</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/logout" className="ps-2">
                      <Nav.Link>Logout</Nav.Link>
                    </LinkContainer>
                  </div>
                ) : (
                  <div className="border-start border-4 border-success">
                    <LinkContainer to="/login" className="ps-2">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/register" className="ps-2">
                      <Nav.Link>Register</Nav.Link>
                    </LinkContainer>
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>

            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route exact path="/" />
              <Route exact path="/add-article" element={<AddArticle />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/add-friend" element={<AvailableFriends />} />
              <Route exact path="/my-profile" element={<MyProfile />} />
            </Route>

          </Routes>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
