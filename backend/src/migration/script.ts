import { initializeMongo } from "../utils/MongoConnect";

const main = async () => {
  console.log(process.argv);
  const file = process.argv[2];
  if (!file) {
    throw new Error("File is required");
  }
  await initializeMongo(process.argv[3]);
  console.log("Mongo connected");
  try {
    const module = require(file);
    console.log("module imported");
    console.log("running module");
    console.log(module, file);
    const res = await module.run();
    console.log("module run finished.", res);
  } catch (err) {
    console.log(err);
  }
};
main();
