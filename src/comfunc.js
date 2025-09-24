  export const validateField = (name, value,formData) => {
     const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
     let fieldErrors = {};

    if (name === "username") {
      if (!value) fieldErrors.username = "Name is required";
      else if (value.length > 50) fieldErrors.username = "Name must be less than 50 characters";
      else delete fieldErrors.username;
    }

    if (name === "email") {
      if (!value) fieldErrors.email = "Email is required";
      else if (!value.includes("@") || !value.endsWith(".com"))
        fieldErrors.email = "Email must include '@' and end with '.com'";
      else delete fieldErrors.email;
    }

    if (name === "password") {
      if (!value) fieldErrors.password = "Password is required";
      else if (value.length < 8) fieldErrors.password = "Password must be at least 8 characters";
      else if (!specialCharRegex.test(value))
        fieldErrors.password = "Password must include at least one special character";
      else delete fieldErrors.password;

      if (formData.confirmPass && value !== formData.confirmPass)
        fieldErrors.confirmPass = "Passwords do not match";
      else if (formData.confirmPass) delete fieldErrors.confirmPass;
    }

    if (name === "confirmPass") {
      if (!value) fieldErrors.confirmPass = "Confirm Password is required";
      else if (value !== formData.password) fieldErrors.confirmPass = "Passwords do not match";
      else delete fieldErrors.confirmPass;
    }

    return fieldErrors;
  };
  