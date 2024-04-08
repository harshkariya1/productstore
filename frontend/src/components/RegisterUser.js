import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";


const RegisterUser = () => {
  
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [profilePic, setProfilePic] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;

    if (email && email.length && email.match(emailRegExp)) {
      // Set email state only if it's valid
      setEmail(email);
    } else {
      // Notify user about invalid email
      toast.error("Invalid email address");
      setLoading(false); // Reset loading state
      return; // Exit the function early since the email is invalid
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("hobbies", hobbies);
    formData.append("userRole", userRole);
    formData.append("profilePic", profilePic);

    try {
        // Make API call
        const response = await axios.post(
          "http://localhost:5000/users/register",
          formData,
          {
            withCredentials: true,
          }
        );
    
        if (response.data.message === "success") {
          // Clear form fields
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setCnfPassword("");
          setGender("");
          setHobbies("");
          setUserRole("user");
          setProfilePic("");
    
          // Show success toast
          toast.success("Register Successful");
    
          // Navigate to login page
          navigate("/login");
        } else {
          // Show error toast
          toast.error("There is an error");
          console.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong, try again");
        }
      } finally {
        setLoading(false);
      }
    };
  const MAX_FILE_SIZE_MB = 1;
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size should be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    } else if (!file.type == "image") {
      toast.error(`File should be of Image type only`);
    } else {
      setProfilePic(file);
    }
  };

  return (
    <div className="container">
  <div className="row justify-content-center align-items-center vh-100">
    <div className="col-md-6">
      <div className="sign-in__wrapper">
        <div className="sign-in__backdrop"></div>
        <Form
          name="form"
          className="shadow p-4 bg-dark rounded"
          onSubmit={handleFormSubmit}
        >
          <div className="h4 mb-2 text-center text-light">Sign In</div>
          <Form.Group className="mb-2" controlId="firstName">
            <Form.Label className="text-light">First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="rounded-pill bg-dark text-light"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="lastName">
            <Form.Label className="text-light">Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              required
              className="rounded-pill bg-dark text-light"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="email">
            <Form.Label className="text-light">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-pill bg-dark text-light"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="password">
            <Form.Label className="text-light">Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-pill bg-dark text-light"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="cnfpassword">
            <Form.Label className="text-light">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={cnfPassword}
              placeholder="Password"
              onChange={(e) => setCnfPassword(e.target.value)}
              required
              className="rounded-pill bg-dark text-light"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="gender">
  <Form.Label className="text-light">Gender</Form.Label>
  <div>
    <Form.Check
    className="text-light"
      inline
      label="Male"
      type="radio"
      id="male"
      name="gender"
      value="male"
      checked={gender === "male"}
      onChange={(e) => setGender(e.target.value)}
    />
    <Form.Check
      inline
      className="text-light"
      label="Female"
      type="radio"
      id="female"
      name="gender"
      value="female"
      checked={gender === "female"}
      onChange={(e) => setGender(e.target.value)}
    />
    <Form.Check
      inline
      className="text-light"
      label="Other"
      type="radio"
      id="other"
      name="gender"
      value="other"
      checked={gender === "other"}
      onChange={(e) => setGender(e.target.value)}
    />
  </div>
</Form.Group>

          <Form.Group className="mb-2" controlId="hobbies">
            <Form.Label className="text-light">Hobbies</Form.Label>
            <Form.Control
              type="text"
              value={hobbies}
              placeholder="Hobbies"
              onChange={(e) => setHobbies(e.target.value)}
              required
              className="rounded-pill bg-dark text-light"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="profilePic">
            <Form.Label className="text-light">Profile Picture</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              required
              className="bg-dark text-light"
            />
          </Form.Group>

          <Button
            className="w-100 rounded-pill bg-primary"
            variant="primary"
            type="submit"
            onChange={handleFormSubmit}
          >
            Register
          </Button>
        </Form>
      </div>
    </div>
  </div>
</div>

 
  );
};

export default RegisterUser;