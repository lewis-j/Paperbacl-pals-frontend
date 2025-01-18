import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Form,
  Button,
  Alert,
  Label,
  FormGroup,
  Input,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordReset } from "../../firebase";
import { useSelector } from "react-redux";
import * as condition from "../../../../data/asyncStatus";
import authStyles from "../auth.module.scss";
import errMsgStyles from "../ErrorMsg/ErrorMsg.module.scss";
import ErrorMsg from "../ErrorMsg/ErrorMsg";
export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser: user, status } = useSelector((state) => state.authUser);

  useEffect(() => {
    if (loading) return;
    if (user && status === condition.SUCCEEDED) navigate("app");
  }, [user, loading, status, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await sendPasswordReset(email);
      setMessage("Check your inbox for further instructions");
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  }

  return (
    <div className={authStyles.wrapper}>
      <Card className={authStyles.container}>
        <CardBody>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <div className={errMsgStyles.msg}>{error}</div>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <FormGroup id="email">
              <ErrorMsg msg={error}>
                <Label>Email</Label>
                <Input
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </ErrorMsg>
            </FormGroup>
            <Button disabled={loading} className="w-100" type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link to="../">Log In</Link>
          </div>
        </CardBody>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="../signup">Sign Up</Link>
        </div>
      </Card>
    </div>
  );
}
