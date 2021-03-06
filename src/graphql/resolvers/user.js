import bcrypt from "bcrypt";
import { ApolloError } from "apollo-server-express";

import { formatUser, generateAuthToken } from "../../helpers/userFunctions";
import {
  UserRegisterationRules,
  UserAuthenticationRules,
} from "../../validations";

export default {
  Query: {
    users: async (_, { skip, limit }, { User }) => {
      const users = await User.find()
        .skip((skip - 1) * limit)
        .limit(limit);
      return users;
    },

    login: async (_, { email, password }, { User }) => {
      await UserAuthenticationRules.validate({
        email,
        password,
      });

      const user = await User.findOne({ email });

      if (!user) {
        throw new ApolloError("Denied Access!", 404);
      }

      const compareResult = await bcrypt.compare(password, user.password);
      if (!compareResult) {
        throw new ApolloError("Denied Access!", 403);
      }
      // Format user
      const resultUser = formatUser(user);

      // Generate Token
      const token = await generateAuthToken(resultUser);
      return {
        user: resultUser,
        token,
      };
    },
  },

  Mutation: {
    register: async (_, { userInput }, { User }) => {
      const { firstName, lastName, email, password } = userInput;
      await UserRegisterationRules.validate({
        firstName,
        lastName,
        email,
        password,
      });

      const user = await User.findOne({ email });

      if (user) {
        throw new Error("This user already exists!");
      }

      const hashpwd = await bcrypt.hash(password, 12);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashpwd,
      });
      let resultUser = await newUser.save();

      // Format user
      resultUser = formatUser(resultUser);

      // Generate Token
      const token = await generateAuthToken(resultUser);
      return {
        user: resultUser,
        token,
      };
    },

    updateUser: async (_, { userInput, id }, { User, user }) => {
      if (id !== user.id) {
        throw new ApolloError("Denied Access", 401);
      }
      let targetUser = await User.findById(id);
      targetUser.firstName = userInput.firstName || targetUser.firstName;
      targetUser.lastName = userInput.lastName || targetUser.lastName;
      targetUser.email = userInput.email || targetUser.email;

      let resultUser = await targetUser.save();

      // Format user
      resultUser = formatUser(resultUser);

      return {
        ...resultUser,
      };
    },
  },
};
