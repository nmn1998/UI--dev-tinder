import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const result = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      setError("");
      dispatch(addUser(result.data.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
      console.log(err);
    }
  };
  const handleSignup = async () => {
    try {
      const result = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(result.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
      console.log(err);
    }
  };
  return (
    <>
      <div className="my-10 flex justify-center">
        <div className="card bg-base-300 w-96 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              {isLogin ? "Login Form" : "Signup Form"}
            </h2>
            {!isLogin && (
              <>
                <fieldset className="fieldset my-2">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e?.target?.value)}
                    type="text"
                    className="input"
                  />
                </fieldset>
                <fieldset className="fieldset my-2">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e?.target?.value)}
                    type="text"
                    className="input"
                  />
                </fieldset>
              </>
            )}
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Email Id</legend>
              <input
                value={emailId}
                onChange={(e) => setEmailId(e?.target?.value)}
                type="email"
                className="input"
              />
            </fieldset>
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Password</legend>
              <input
                value={password}
                onChange={(e) => setPassword(e?.target?.value)}
                type="password"
                className="input"
                required
              />
            </fieldset>
            <p className="text-red-500">{error}</p>
            <div className="card-actions justify-center">
              <button
                onClick={isLogin ? handleLogin : handleSignup}
                className="btn btn-primary"
              >
                {isLogin ? "Login" : "Signup"}
              </button>
            </div>
            <p className="text-center my-3">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 cursor-pointer"
              >
                {isLogin ? "Signup" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
