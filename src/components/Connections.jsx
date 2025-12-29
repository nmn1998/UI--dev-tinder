import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const navigate = useNavigate();
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getConnections();
  }, []);
  if (connections.length === 0)
    return (
      <div className="text-center p-2 m-4 text-2xl font-bold">
        No connections found.
      </div>
    );
  return (
    <>
      <div className="text-center p-2 m-4">
        <div className="text-2xl font-bold">Connections</div>
        {connections.map((connection) => {
          return (
            <div
              key={connection._id}
              className="mx-auto w-1/2 rounded-lg bg-base-300 p-4 my-4"
            >
              <h2 className="text-2xl font-bold">
                {connection.firstName} {connection.lastName}
                {connection.gender && connection.age && (
                  <p className="text-sm text-gray-500">
                    {connection.gender}, {connection.age}
                  </p>
                )}
              </h2>
              <p>{connection.about}</p>
              <button
                className="m-4 btn btn-primary"
                onClick={() =>
                  navigate(
                    `/chat/${connection._id}?name=${connection.firstName} ${connection.lastName}`
                  )
                }
              >
                Chat
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Connections;
