import apolloServer = require("@apollo/server");
import standAloneServer = require("@apollo/server/standalone");
import graphqlSchema = require("./src/schema/graphql");
import mongoConnect = require("./src/utils/MongoConnect");
import authHelper = require("./src/auth");
import graphql = require("graphql");
import dotenv = require("dotenv");

//Queries
import orderQuery = require("./src/controller/query/order");
import userQuery = require("./src/controller/query/user");
import chartQuery = require("./src/controller/query/chart");
import productQuery = require("./src/controller/query/product");
import getVersionItem = require("./src/controller/query/getVersionItem");
import expenseQuery = require("./src/controller/query/expense");
import productSchemaQuery = require("./src/controller/query/productSchema");

//Mutations
import expenseMutation = require("./src/controller/mutation/expense");
import productMutation = require("./src/controller/mutation/product");
import userMutation = require("./src/controller/mutation/user");
import orderMutation = require("./src/controller/mutation/order");
import productSchemaMutation = require("./src/controller/mutation/productSchema");

const resolvers = {
  Query: {
    ...orderQuery,
    ...expenseQuery,
    ...productQuery,
    ...userQuery,
    ...chartQuery,
    ...getVersionItem,
    ...productSchemaQuery,
  },
  Mutation: {
    ...productMutation,
    ...orderMutation,
    ...expenseMutation,
    ...userMutation,
    ...productSchemaMutation,
  },
};
dotenv.configDotenv();
const server = new apolloServer.ApolloServer({
  //typeDefs,
  typeDefs: graphqlSchema.GraphqlSchema,
  //resolvers
  resolvers: resolvers,
});

//Initialize mongo
mongoConnect.initializeMongo();
standAloneServer.startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }: any) => {
    const auth = req.headers.authorization;
    if (!auth) {
      return { user: false };
    }
    const user = await authHelper.isAuthenicatedUser(auth);
    console.log("CONNECTING");

    // if (!user) {
    //   throw new graphql.GraphQLError("User is not authenticated", {
    //     extensions: {
    //       code: "UNAUTHENTICATED",
    //       http: { status: 401 },
    //     },
    //   });
    // }
    return { user };
  },
});
