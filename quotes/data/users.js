import { v4 as _id } from "uuid";

const defaultUser = {
  id: _id(),
  username: "Abdul",
  password: Buffer.from("Abdul").toString("base64"),
};

const users = [];

users.push(defaultUser);

function registerUser(user) {
  Object.assign(user, {
    id: _id(),
  });
  users.push(user);
  return user;
}

function userExist(id) {
  return users.find((u) => u.id === id);
}

function findUser(name) {
  const foundUser = users.find((u) => u.username === name);
  if (!foundUser) {
    return null;
  }
  return foundUser;
}

export { users, registerUser, findUser, userExist };
