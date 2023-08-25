import { Icon } from "@iconify/react";
import TextInput from "../components/shared/TextInput";
import PasswordInput from "../components/shared/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { makeUnauthenticatedPOSTRequest } from "../utils/serverHelpers";

const SignupComponent = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const signUp = async () => {
    if (password !== confirmPassword) {
      alert("Password Fields are not matching");
      return;
    }
    const data = { email, password, username };
    const response = await makeUnauthenticatedPOSTRequest(
      "/auth/register",
      data
    );
    if (response && !response.err) {
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });
      alert("Success");
      navigate("/app");
    } else {
      alert("Failure");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="logo p-5 border-b border-solid border-gray-300 w-full flex justify-center items-center align-items">
        <Icon
          icon="streamline:entertainment-camera-video-film-television-tv-camera-movies-video-recorder"
          width={50}
        />
        REACT RECORDER APP
      </div>
      <div className="inputRegion w-1/3 py-10 flex items-center justify-center flex-col">
        <div className="font-bold mb-4 text-2xl">Sign up</div>
        <TextInput
          label="Email address"
          placeholder="Enter your email"
          className="my-6"
          value={email}
          setValue={setEmail}
        />
        <TextInput
          label="Username"
          placeholder="Enter your Username"
          className="mb-6"
          value={username}
          setValue={setUsername}
        />
        <PasswordInput
          label="Create Password"
          placeholder="Enter a strong password here"
          value={password}
          setValue={setPassword}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Enter your password again"
          value={confirmPassword}
          setValue={setConfirmPassword}
        />
        <div className="w-full flex items-center justify-center my-8">
          <button
            className="bg-green-400 font-semibold p-3 px-10 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              signUp();
            }}
          >
            Sign Up
          </button>
        </div>
        <div className="w-full border border-solid border-gray-300"></div>
        <div className="my-6 font-semibold text-lg">
          Already have an account?
        </div>
        <div className="border border-gray-500 text-gray-500 w-full flex items-center justify-center py-4 rounded-full font-bold">
          <Link to="/login">LOG IN INSTEAD</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
