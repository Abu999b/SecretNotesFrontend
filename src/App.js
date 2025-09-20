import React, { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Notes from "./components/Notes";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <div className="app-container">
      <h1>📝 Secure Notes App</h1>
      <div className="app-box">
        {!token ? (
          <>
            <Register />
            <Login setToken={setToken} />
          </>
        ) : (
          <Notes token={token} setToken={setToken} />
        )}
      </div>
    </div>
  );
}

export default App;
