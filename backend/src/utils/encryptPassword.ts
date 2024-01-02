import bcrypt = require("bcrypt");

const saltRounds: number = (process.env.SALT as unknown as number) || 10;
bcrypt.genSalt(saltRounds);
const encryptPassword = async (value: string) => {
  console.log(await bcrypt.hash(value, saltRounds));
  return await bcrypt.hash(value, saltRounds);
};

const checkIfHasMatches = async (
  hash: string,
  data: string
): Promise<boolean> => {
  return await bcrypt.compare(data, hash);
};

export { encryptPassword, checkIfHasMatches };
