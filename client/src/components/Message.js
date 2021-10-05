import React from "react";
import { Alert } from "react-bootstrap";

const Message = ({ variant, className, children }) => {
  return (
    <Alert variant={variant} className={className}>
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: "danger",
};

export default Message;
