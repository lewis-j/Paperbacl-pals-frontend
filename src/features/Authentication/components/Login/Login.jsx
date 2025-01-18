import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Button,
  CardBody,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { loginGoogle, loginWithForm } from "../../authUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import * as condition from "../../../../data/asyncStatus";
import authStyle from "../auth.module.scss";
import ErrorMsg from "../ErrorMsg/ErrorMsg";
import ErrMsgStyle from "../ErrorMsg/ErrorMsg.module.scss";

export default function Login() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const {
    currentUser: user,
    status,
    error: asyncErrors,
  } = useSelector((state) => state.authUser);
  const navigate = useNavigate();

  const loading = status === condition.LOADING;

  useEffect(() => {
    if (user && status === condition.SUCCEEDED) {
      navigate("app");
    }
  }, [status, user, navigate, asyncErrors]);

  const handleSubmit = async (e) => {
    setError(() => null);
    e.preventDefault();
    const error = {};
    if (!formValues.email) {
      error.email = error.message = "Email is required!";
      return setError(error);
    }
    if (!formValues.password) {
      error.password = error.message = "password is required!";
      return setError(error);
    }

    dispatch(loginWithForm({ email, password }));
  };

  const handleOnChange = (e) => {
    setError({});
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!error && asyncErrors) {
    const error = { message: asyncErrors };
    setError(error);
  }

  const { email, password } = formValues;

  return (
    <div className={authStyle.wrapper}>
      <Card className={authStyle.container}>
        <CardBody>
          <h2 className="text-center my-4">Log In</h2>
          {error?.message && (
            <div className={ErrMsgStyle.msg}>{error.message}</div>
          )}
          <Form onSubmit={handleSubmit}>
            <FormGroup id="email">
              <ErrorMsg msg={error?.email}>
                <Label>Email</Label>
                <Input
                  style={
                    error?.email ? { borderColor: "red", color: "red" } : {}
                  }
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                />
              </ErrorMsg>
            </FormGroup>
            <FormGroup id="password">
              <ErrorMsg msg={error?.password}>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                />
              </ErrorMsg>
            </FormGroup>
            <Button disabled={loading} className="w-100 mt-2" type="submit">
              Log In
            </Button>
            <Button
              style={{ backgroundColor: "#911f16" }}
              disabled={loading}
              className="w-100 mt-2"
              onClick={() => dispatch(loginGoogle())}
            >
              <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link to="./reset-password">Forgot Password?</Link>
          </div>
        </CardBody>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="./signup">Sign Up</Link>
        </div>
      </Card>
    </div>
  );
}
