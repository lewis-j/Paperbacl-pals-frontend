import ErrMsg from "./ErrorMsg.module.scss";

const ErrorMsg = ({ msg, children }) => {
  return msg ? (
    <div className={ErrMsg.alert}>
      {children}
      {/* <div className={ErrMsg.msg}>{msg}</div> */}
    </div>
  ) : (
    children
  );
};

export default ErrorMsg;
