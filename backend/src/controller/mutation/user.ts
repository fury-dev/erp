import userModel = require("../../schema/mongo/user");
import auth = require("../../auth");
import password = require("../../utils/encryptPassword");

const registerUser = async (_: any, { user = null }: any) => {
  const userObj = new userModel.controller({
    ...user,
    password: await password.encryptPassword(user.password),
  });

  try {
    const res = await userObj.save();
    const token = auth.createToken(res.id);
    return token;
  } catch (err: any) {
    console.error(err);
    return err;
  }
};
const loginUser = async (_: any, { user = null }: any) => {
  try {
    const record = await userModel.controller.findOne({ email: user?.email });
    if (!record) {
      return "Invalid";
    }
    const passwordCheck = await password.checkIfHasMatches(
      record.password,
      user.password
    );
    if (!passwordCheck) {
      return "Invalid password";
    }
    const token = auth.createToken(record?.id);
    return token;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export { loginUser, registerUser };
