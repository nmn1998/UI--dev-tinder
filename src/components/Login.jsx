import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("karan.doe@gmail.com");
  const [password, setPassword] = useState("Karan@1456");
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
      setError('')
      dispatch(addUser(result.data.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong');
      console.log(err);
    }
  };
  return (
    <>
      <div className="my-10 flex justify-center">
        <div className="card bg-base-300 w-96 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Login Form</h2>
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Email Id</legend>
              <input
                value={emailId}
                onChange={(e) => setEmailId(e?.target?.value)}
                type="text"
                className="input"
              />
            </fieldset>
            <fieldset className="fieldset my-2">
              <legend className="fieldset-legend">Password</legend>
              <input
                value={password}
                onChange={(e) => setPassword(e?.target?.value)}
                type="email"
                className="input"
                required
              />
            </fieldset>
            <p className="text-red-500">{error}</p>
            <div className="card-actions justify-center">
              <button onClick={handleLogin} className="btn btn-primary">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
