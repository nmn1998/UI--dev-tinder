import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";
const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);


  const handleUpdate = async () => {
    try {
      const result = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );
    
      dispatch(addUser(result.data.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setError("");
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <div className="my-4 mx-4 flex justify-center">
          <div className="card bg-base-300 w-96 shadow-sm">
            <div className="card-body" style={{ gap: "0px" }}>
              <h2 className="card-title">Edit Profile</h2>
              <fieldset className="fieldset my-1">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e?.target?.value)}
                  type="text"
                  className="input"
                />
              </fieldset>
              <fieldset className="fieldset my-1">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e?.target?.value)}
                  type="text"
                  className="input"
                />
              </fieldset>
              <fieldset className="fieldset my-1">
                <legend className="fieldset-legend">Photo URL</legend>
                <input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e?.target?.value)}
                  type="text"
                  className="input"
                />
              </fieldset>
              <fieldset className="fieldset my-1">
                <legend className="fieldset-legend">Age</legend>
                <input
                  value={age}
                  onChange={(e) => setAge(e?.target?.value)}
                  type="text"
                  className="input"
                />
              </fieldset>
              <fieldset className="fieldset my-1">
                <legend className="fieldset-legend">Gender</legend>
                <select
                  value={gender}
                  onChange={(e) => setGender(e?.target?.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </fieldset>
              <fieldset className="fieldset my-1">
                <legend className="fieldset-legend">About</legend>
                <input
                  value={about}
                  onChange={(e) => setAbout(e?.target?.value)}
                  type="text"
                  className="input"
                />
              </fieldset>
              <p className="text-red-500 text-center">{error}</p>
              <div className="card-actions justify-center my-2">
                <button onClick={handleUpdate} className="btn btn-primary">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <UserCard
            feed={{
              firstName,
              lastName,
              photoUrl,
              age,
              gender,
              about,
            }}
          />
        </div>
      </div>
      {showToast && (
        <div className="toast toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
