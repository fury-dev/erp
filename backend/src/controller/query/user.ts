import userModel = require("../../schema/mongo/user");
import auth = require("../../auth");
import password = require("../../utils/encryptPassword");

const userValidation = async (_: any, args: any) => {
  console.log(args);
  try {
    const id = await auth.validateToken(args.token);

    const record = await userModel.controller.findById(id.value, {
      _id: 0,
      email: 1,
      username: 1,
    });
    return record;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export { userValidation };
