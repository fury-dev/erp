import mongoose = require("mongoose");

var validateName = (name: string) => {
  var re = /[^A-Za-z_ ]+/;
  return !re.test(name);
};
var validateEmail = (email: string) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const User = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username required"],
    validate: [validateName, "Special characters  and Numbers are not allowed"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
    validate: [validateEmail, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
  },
  auth_login: {
    type: Boolean,
    required: true,
  },
});
const controller = mongoose.model("Users", User);
export { controller, User };
