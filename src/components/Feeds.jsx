import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeeds } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feeds = () => {
  const dispatch = useDispatch();
  const feeds = useSelector((store) => store.feeds);
  const getFeeds = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/feeds", {
        withCredentials: true,
      });
      dispatch(addFeeds(res?.data?.data));
    } catch (err) {}
  };

  useEffect(() => {
    getFeeds();
  }, []);
  if (feeds.length === 0)
    return (
      <div className="text-center p-2 m-4 text-2xl font-bold">
        No New Users found.
      </div>
    );
  return (
    <>
      {feeds?.length && (
        <div className="flex justify-center">
          <UserCard feed={feeds[0]} showInterest={true}></UserCard>
        </div>
      )}
    </>
  );
};

export default Feeds;
