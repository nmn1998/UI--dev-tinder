import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ feed, showInterest = false }) => {
  const { firstName, lastName, photoUrl, age, gender, skills, about } = feed;
  const dispatch = useDispatch();

  const handleRequest = async (status, feedId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + feedId,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeed(feedId));
    } catch (err) {
      console.log(err);
    } 
  };

  return (
    <>
      <div className="card bg-base-300 w-96 shadow-sm my-4">
        <figure>
          <img
            style={{ borderRadius: "8px", width: "100%", height: "100%" }}
            src={
              photoUrl ||
              "https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg"
            }
            alt="photo"
          />
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title">
            {firstName} {lastName}
          </h2>
          {gender && age && (
            <p>
              {gender} , {age}
            </p>
          )}
          <p>{about}</p>
          {showInterest && (
            <div className="card-actions justify-center my-4">
              <button
                onClick={() => handleRequest("ignored", feed._id)}
                className="btn btn-primary"
              >
                Ignore
              </button>
              <button
                onClick={() => handleRequest("interested", feed._id)}
                className="btn btn-secondary"
              >
                Interested
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserCard;
