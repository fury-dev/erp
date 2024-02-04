import productModel = require("../../schema/mongo/product");
import productSchemaModel = require("../../schema/mongo/productSchema");
import lodash = require("lodash");
import fs = require("fs");

// implementing productSchema concept where productSchema can be a bluePrint to the product
const productToProductSchemaMigration = async () => {
  const data = (await productModel.controller.find({})).map((value) => {
    let id = value.productId;
    let item = lodash.omit(
      lodash.omit(lodash.omit(value.toJSON(), "productId"), "id"),
      "_id"
    );
    if (!id) {
      id = Math.floor(10000 + Math.random() * 900000);
    }

    return {
      ...item,

      productSchemaId: id,
      versions: item.versions.map((value) =>
        lodash.omit(lodash.omit(value, "id"), "_id")
      ),
    };
  });
  const filePath = "example.txt";
  fs.writeFile(filePath, JSON.stringify(data), (err) => {
    console.error(err);
  });
  console.log(data.length);
  try {
    await productSchemaModel.controller.deleteMany({});
    const res = await productSchemaModel.controller.insertMany(data);
    console.log("AFFECTED", res.length);
    await productModel.controller.deleteMany({});
    return res.length;
  } catch (err) {
    console.error(err);
  }
};
const run = async () => {
  return await productToProductSchemaMigration();
};
export { productToProductSchemaMigration, run };
