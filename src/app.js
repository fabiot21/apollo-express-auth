import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { ApolloServer } from "apollo-server-express";

import * as DBModels from "./models";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import AuthMiddleware from "./middlewares/auth";
import { schemaDirectives } from "./graphql/directives";

config();
const app = express();

// Remove x-powered-by header
app.disable("x-powered-by");

// Middlewares
app.use(AuthMiddleware);

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: process.env.ENV === "dev",
  context: ({ req }) => {
    const { user, isAuth } = req;

    return {
      req,
      user,
      isAuth,
      ...DBModels,
    };
  },
});

server.applyMiddleware({ app });

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((res) => {
    app.listen(process.env.PORT);
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
