import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Note from "./Components/Note";
import Notfound from "./Components/Notfound";
import ProtectedRoute from "./Components/ProtectedRoute";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import AuthContextProvider from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route
              path=""
              element={
                <ProtectedRoute>
                  <Note />
                </ProtectedRoute>
              }
            />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </div>
      </AuthContextProvider>
    </>
  );
}

export default App;
