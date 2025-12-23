import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
    } catch (err) {
      if (err.status == 401) navigate("/login");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <Navbar></Navbar>
      <Outlet />
      <Footer></Footer>
    </div>
  );
};

export default Body;
