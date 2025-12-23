import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getRequests();
  }, []);

  const handleReject = async (requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/rejected/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.log(err);
    }
  };
  const handleAccept = async (requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/accepted/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.log(err);
    }
  };
  if (requests.length === 0)
    return (
      <div className="text-center p-2 m-4 text-2xl font-bold">
        No requests received.
      </div>
    );
  return (
    <div className="text-center p-2 m-4">
      <div className="text-2xl font-bold">Requests Received</div>
      {requests.map((request) => {
        return (
          <div
            key={request._id}
            className="mx-auto w-1/2 rounded-lg bg-base-300 p-4 my-4"
          >
            <h2 className="text-2xl font-bold">
              {request.fromUserId?.firstName} {request.fromUserId?.lastName}
              {request.fromUserId?.gender && request.fromUserId?.age && (
                <p className="text-sm text-gray-500">
                  {request.fromUserId?.gender}, {request.fromUserId?.age}
                </p>
              )}
            </h2>
            <p className="my-2">{request.fromUserId?.about}</p>
            <button
              className="btn btn-primary m-2"
              onClick={() => handleReject(request._id)}
            >
              Reject
            </button>
            <button
              className="btn btn-secondary m-2"
              onClick={() => handleAccept(request._id)}
            >
              Accept
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
