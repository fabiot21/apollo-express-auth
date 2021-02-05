import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users(skip: Int!, limit: Int!): [User!]!
    authUser: AuthUser!
    login(email: String!, password: String!): AuthUser!
  }

  extend type Mutation {
    register(userInput: UserInput!): AuthUser!
    updateUser(userInput: UserInput!, id: ID!): User!
    deleteUser(id: ID!): Boolean!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type AuthUser {
    user: User!
    token: String!
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
`;
