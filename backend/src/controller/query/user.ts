import { validateToken } from "../../auth/index";
import userModel from "../../schema/mongo/user";

const userValidation = async (_: any, args: any) => {
  try {
    console.log(args);
    if (args.token) {
      const id = await validateToken(args.token);

      const record = await userModel.controller.findById(id.value, {
        _id: 0,
        email: 1,
        username: 1,
      });
      return record;
    }
    return {};
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default { userValidation };
