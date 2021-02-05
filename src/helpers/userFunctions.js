import _ from "lodash";
import { sign } from "jsonwebtoken";

export const generateAuthToken = async (jwtPayload) => {
  const token = await sign(jwtPayload, process.env.SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export const formatUser = (user) => {
  let newUserFormat = { ...user, id: user._id };
  newUserFormat = _.pick(user, ["id", "firstName", "lastName", "email"]);
  return newUserFormat;
};
