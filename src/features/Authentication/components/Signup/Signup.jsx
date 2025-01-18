import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Button,
  Input,
  Label,
  FormGroup,
  CardBody,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../authUserSlice";
import * as condition from "../../../../data/asyncStatus";
import authStyle from "../auth.module.scss";
import ErrorMsg from "../ErrorMsg/ErrorMsg";
import ErrMsgStyle from "../ErrorMsg/ErrorMsg.module.scss";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Signup");

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecial: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(false);

  const {
    currentUser: user,
    status,
    error: asyncErrors,
  } = useSelector((state) => state.authUser);

  const loading = status === condition.LOADING;

  useEffect(() => {
    if (user && status === condition.SUCCEEDED) {
      navigate("app");
    }
  }, [status, user, navigate]);

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(() => ({}));
    const error = {};
    if (!formValues.name) {
      error.name = error.message = "Username is required!";
      return setError(error);
    }
    if (!formValues.email) {
      error.email = error.message = "Email is required!";
      return setError(error);
    }
    if (!formValues.password) {
      error.password = error.message = "Password is required!";
      return setError(error);
    }
    if (!formValues.confirmPassword) {
      error.confirmPassword = error.message = "Please confirm your password";
      return setError(error);
    }
    if (password !== confirmPassword) {
      error.password = error.message = "Passwords must match";
      return setError(error);
    }

    if (!validatePassword(formValues.password)) {
      error.password = error.message = "Password does not meet requirements";
      return setError(error);
    }

    let trimmedName = name;
    trimmedName = trimmedName.trim().replace(/\s+/g, " ");

    dispatch(registerUser({ username: trimmedName, email, password }));
  };

  const handleOnChange = (e) => {
    setError({});
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.name === "password") {
      validatePassword(e.target.value);
      setPasswordMatch(e.target.value === formValues.confirmPassword);
    }

    if (e.target.name === "confirmPassword") {
      setPasswordMatch(formValues.password === e.target.value);
    }
  };

  const { name, email, password, confirmPassword } = formValues;

  if (!error && asyncErrors) {
    const error = { message: asyncErrors };
    setError(error);
  }

  return (
    <div className={authStyle.wrapper} id="signup">
      <Card className={authStyle.container}>
        <CardBody>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error.message && (
            <div className={ErrMsgStyle.msg}>{error.message}</div>
          )}
          <Form onSubmit={handleSubmit}>
            <FormGroup id="name">
              <ErrorMsg msg={error.name}>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={name}
                  name="name"
                  onChange={handleOnChange}
                />
              </ErrorMsg>
            </FormGroup>
            <FormGroup id="email">
              <ErrorMsg msg={error.email}>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                />
              </ErrorMsg>
            </FormGroup>
            <FormGroup id="password">
              <ErrorMsg msg={error.password}>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                />
                {password !== "" && (
                  <div className="password-requirements mt-2">
                    <small
                      className={`d-block ${
                        passwordRequirements.minLength
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      ✓ At least 8 characters
                    </small>
                    <small
                      className={`d-block ${
                        passwordRequirements.hasNumber
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      ✓ At least one number
                    </small>
                    <small
                      className={`d-block ${
                        passwordRequirements.hasUppercase
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      ✓ At least one uppercase letter
                    </small>
                    <small
                      className={`d-block ${
                        passwordRequirements.hasLowercase
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      ✓ At least one lowercase letter
                    </small>
                    <small
                      className={`d-block ${
                        passwordRequirements.hasSpecial
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      ✓ At least one special character
                    </small>
                  </div>
                )}
              </ErrorMsg>
            </FormGroup>
            <FormGroup id="password-confirm">
              <ErrorMsg msg={error.confirmPassword}>
                <Label>Password Confirmation</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                />
                {confirmPassword && (
                  <small
                    className={`d-block mt-2 ${
                      passwordMatch ? "text-success" : "text-danger"
                    }`}
                  >
                    {passwordMatch
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </small>
                )}
              </ErrorMsg>
            </FormGroup>
            {!error.message && (
              <Button disabled={loading} className="w-100" type="submit">
                Sign up
              </Button>
            )}
          </Form>
        </CardBody>
        <div className="w-100 text-center mt-2">
          Have an account? <Link to="../">Log In</Link>{" "}
        </div>
      </Card>
    </div>
  );
}
