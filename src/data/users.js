const bcrypt = require("bcrypt");

const users = [
  {
    userName: "Admin",
    email: "admin@example.com",
    password: "Admin123",
    role: "admin",
    avatar: "https://example.com/avatar/carlos.png",
    favoriteEvents: []
  },
  {
    userName: "Lucia",
    email: "lucia@example.com",
    password: "Lucia123",
    role: "user",
    avatar: "https://example.com/avatar/lucia.png",
    favoriteEvents: []
  },
  {
    userName: "Miguel",
    email: "miguel@example.com",
    password: "Miguel123",
    role: "user",
    avatar: "https://example.com/avatar/miguel.png",
    favoriteEvents: []
  }
];

const usersPasswordHashed = async () => {
  for (let user of users) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  return users;
};

usersPasswordHashed();

module.exports = users;
