import bcrypt from "bcrypt";

const saltRounds: number = (process.env.SALT as unknown as number) || 10;
bcrypt.genSalt(saltRounds);
export const hashPassword = async (value: string) => {
  console.log(await bcrypt.hash(value, saltRounds));
  return await bcrypt.hash(value, saltRounds);
};

export const checkIfHasMatches = async (
  hash: string,
  data: string
): Promise<boolean> => {
  return await bcrypt.compare(data, hash);
};
