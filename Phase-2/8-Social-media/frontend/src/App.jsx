import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/Login";
import Home from "./components/Home";

const isAuthenticated = () => Boolean(localStorage.getItem("token"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />}
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/home" /> : <Register />}
        />
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
