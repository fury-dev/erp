import mongoConnect = require("./src/utils/MongoConnect");
import expenseModel = require("./src/schema/mongo/expense");
import productModel = require("./src/schema/mongo/product");
import orderModel = require("./src/schema/mongo/order");

const data = {
  versionId: 1,
  customerName: "Rajeev Dessai",
  orderId: 124594,
  orderDate: "2024-01-02T09:32:17.344Z",
  orderType: "CASH_ON_DELIVERY",
  amount: {
    amount: 900,
    currency: "INR",
  },
  productId: "6588267ebef07e67843822df",
  status: "PENDING",
  product: null,
  location: null,
  paymentStatus: false,
  deliveryDate: null,
  createdAt: "1704187974314",
  updatedAt: "1704187974297",
};
mongoConnect.initializeMongo();
