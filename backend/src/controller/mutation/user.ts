import userModel = require("../../schema/mongo/user");
import auth = require("../../auth");
import password = require("../../utils/encryptPassword");
import response = require("../../utils/generateMessage");

const registerUser = async (_: any, { user = null }: any) => {
  const userObj = new userModel.controller({
    ...user,
    password: await password.encryptPassword(user.password),
  });

  try {
    const res = await userObj.save();
    console.log(res, "SSS");
    const token = auth.createToken(res?.id);
    return JSON.stringify(
      response.generateMessage(200, {
        message: "Signin successful",
        auth: {
          token,
          duration: process.env.TOKEN_LIFESPAN,
        },
      })
    );
  } catch (err: any) {
    console.log(err);
    if (err.code === 11000) {
      return JSON.stringify(
        response.generateMessage(200, null, {
          message: "Email Already Exists",
        })
      );
    }
    return err;
  }
};
const loginUser = async (_: any, { user = null }: any) => {
  console.log("Login In");
  try {
    const record = await userModel.controller.findOne({ email: user?.email });
    if (!record) {
      return JSON.stringify(
        response.generateMessage(400, null, {
          message: "Invalid Credentials",
        })
      );
    }
    const passwordCheck = await password.checkIfHasMatches(
      record.password,
      user.password
    );
    if (!passwordCheck) {
      return JSON.stringify(
        response.generateMessage(400, null, {
          message: "Invalid password",
        })
      );
    }
    const token = auth.createToken(record?.id);

    return JSON.stringify(
      response.generateMessage(200, {
        message: "Signup successful",
        auth: {
          token,
          duration: process.env.TOKEN_LIFESPAN,
          user: {
            email: user.email,
            username: record.username,
          },
        },
      })
    );
  } catch (err) {
    console.error(err);
    return new Error("Server error");
  }
};

export { loginUser, registerUser };
