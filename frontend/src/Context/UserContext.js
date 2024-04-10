import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/profile/1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status == 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, getProfile }}>
      {children}
    </UserContext.Provider>
  );
};