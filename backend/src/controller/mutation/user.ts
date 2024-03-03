import { createToken } from "../../auth/index";
import userModel from "../../schema/mongo/user";
import response from "../../utils/generateMessage";
import { OAuth2Client } from "google-auth-library";
import { checkIfHasMatches, hashPassword } from "../../utils/hashPassword";

const cliendId = process.env.CLIENT_ID;
const registerUser = async (_: any, { user = null }: any) => {
  const userObj = new userModel.controller({
    ...user,
    password: await hashPassword(user.password),
  });

  try {
    const res = await userObj.save();
    console.log(res, "SSS");
    const token = createToken(res?.id);
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
  console.log("Login In", user);
  try {
    const record = await userModel.controller.findOne({ email: user?.email });
    if (!record) {
      return JSON.stringify(
        response.generateMessage(400, null, {
          message: "Invalid Credentials",
        })
      );
    }
    const passwordCheck = await checkIfHasMatches(
      record.password || "",
      user.password
    );
    if (!passwordCheck) {
      return JSON.stringify(
        response.generateMessage(400, null, {
          message: "Invalid password",
        })
      );
    }
    const token = createToken(record?.id);

    return JSON.stringify(
      response.generateMessage(200, {
        message: "Signup successful",
        auth: {
          token,
          duration: process.env.TOKEN_LIFESPAN,
        },
        user: {
          email: user.email,
          username: record.username,
        },
      })
    );
  } catch (err) {
    console.error(err);
    return new Error("Server error");
  }
};
const loginWithGoogle = async (_: any, args: any) => {
  try {
    console.log("Login In With Google", args);

    const { credentials } = args;
    const authClient = new OAuth2Client(cliendId);
    if (credentials) {
      const ticket = await authClient.verifyIdToken({
        idToken: credentials,
        audience: cliendId,
      });
      const payload = ticket.getPayload();
      let res = await userModel.controller.findOne({
        email: payload?.email,
      });
      if (!res) {
        const user = new userModel.controller({
          email: payload?.email,
          username: payload?.name,
          auth_login: true,
        });
        res = await user.save();
      }

      const token = createToken(res?.id);
      return JSON.stringify(
        response.generateMessage(200, {
          message: "Signin successful",
          auth: {
            token,
            duration: process.env.TOKEN_LIFESPAN,
          },
        })
      );
    }

    return {};
  } catch (err) {
    console.error(err);
    return err;
  }
};
export default { loginUser, registerUser, loginWithGoogle };
