const validateSignupInput = (name, email, password) => {
  const inputError = {};
  if (name.trim() === "") {
    inputError.name = "Name must not be empty";
  }

  if (email.trim() === "") {
    inputError.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-.\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      inputError.email = "Invalid email";
    }
  }

  if (password === "") {
    inputError.password = "Password must not be empty";
  }
  // else if (password !== confirmPassword) {
  //   errors.confirmPassword = 'Passwords must match'
  // }

  return {
    inputError,
    valid: Object.keys(inputError).length < 1,
  };
};

const validateSigninInput = (email, password) => {
  const inputError = {};

  if (email.trim() === "") {
    inputError.email = "Email must not be empty";
  }

  if (password === "") {
    inputError.password = "Password must not be empty";
  }

  return {
    inputError,
    valid: Object.keys(inputError).length < 1,
  };
};

export { validateSignupInput, validateSigninInput };
