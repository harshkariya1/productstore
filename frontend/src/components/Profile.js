
import React, { useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (!authToken) {
      navigate("/Login");
    }
  }, [authToken, navigate]);

  const profilePicPath = user ? user.profilePic : null;
  const profilePic = profilePicPath
    ? `http://localhost:4000/assets/${profilePicPath}`
    : "https://via.placeholder.com/150";

  return (
    <div class="container rounded bg-white mt-5 mb-5">
      <div class="row">
        <div class="col-md-3 border-right">
          <div class="d-flex flex-column align-items-center text-center p-3 py-5">
            <img class="rounded-circle mt-5" width="150px" src={profilePic} />
            <span class="font-weight-bold">
              {user.firstName} {user.lastName}
            </span>
            <span class="text-black-50">{user.email}</span>
            <span> </span>
          </div>
        </div>
        <div class="col-md-5 border-right">
          <div class="p-3 py-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="text-right">Profile</h4>
            </div>
            <div class="row mt-2">
              <div class="col-md-6">
                <label class="labels">Name</label>
                <input
                  type="text"
                  class="form-control"
                  value={user.firstName}
                  readOnly
                />
              </div>
              <div class="col-md-6">
                <label class="labels">Surname</label>
                <input
                  type="text"
                  class="form-control"
                  value={user.lastName}
                  readOnly
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-12">
                <label class="labels">Email ID</label>
                <input
                  type="text"
                  class="form-control"
                  value={user.email}
                  readOnly
                />
              </div>
              <div class="col-md-12">
                <label class="labels">Gender</label>
                <input
                  type="text"
                  class="form-control"
                  value={user.gender}
                  readOnly
                />
              </div>
              <div class="col-md-12">
                <label class="labels">Hobbies</label>
                <input
                  type="text"
                  class="form-control"
                  value={user.hobbies}
                  readOnly
                />
              </div>
            </div>
            {/* <div class="mt-5 text-center">
              <button class="btn btn-primary profile-button" type="button">
                Edit Profile
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
