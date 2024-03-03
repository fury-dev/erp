import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphqlSchema } from "./schema/graphql";
import { initializeMongo } from "./utils/MongoConnect";
import { configDotenv } from "dotenv";
import { isAuthenicatedUser } from "./auth/index";

//Queries
import orderQuery from "./controller/query/order";
import userQuery from "./controller/query/user";
import chartQuery from "./controller/query/chart";
import productQuery from "./controller/query/product";
import { getVersionItem } from "./controller/query/getVersionItem";
import expenseQuery from "./controller/query/expense";
import productSchemaQuery from "./controller/query/productSchema";
//Mutations
import expenseMutation from "./controller/mutation/expense";
import productMutation from "./controller/mutation/product";
import userMutation from "./controller/mutation/user";
import orderMutation from "./controller/mutation/order";
import productSchemaMutation from "./controller/mutation/productSchema";

const resolvers = {
  Query: {
    ...orderQuery,
    ...expenseQuery,
    ...productQuery,
    ...userQuery,
    ...chartQuery,
    ...productSchemaQuery,
    getVersionItem,
  },
  Mutation: {
    ...productMutation,
    ...orderMutation,
    ...expenseMutation,
    ...userMutation,
    ...productSchemaMutation,
  },
};
configDotenv();
const server = new ApolloServer({
  //typeDefs,
  typeDefs: GraphqlSchema,
  //resolvers
  resolvers: resolvers,
});

//Initialize mongo
initializeMongo();
console.log("Starting server");
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }: any) => {
    const auth = req.headers.authorization;
    if (!auth) {
      return { user: false };
    }
    const user = await isAuthenicatedUser(auth);
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
console.log("Server started");
