import "./output.css";
import LoginComponent from "./routes/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupComponent from "./routes/SignUp";
import { useCookies } from "react-cookie";
import LoggedInComponent from "./components/shared/LoggedInComponent";

function App() {
  const [cookie, setCookie] = useCookies(["token"]);
  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
        {cookie.token ? (
          <Routes>
            <Route path="/app" element={<LoggedInComponent />} />
            <Route path="*" element={<Navigate to="/app" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
