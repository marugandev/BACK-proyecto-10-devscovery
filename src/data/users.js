const bcrypt = require("bcrypt");

const users = [
  {
    userName: "Admin",
    email: "admin@example.com",
    password: "Admin123",
    role: "admin",
    avatar:
      "https://res.cloudinary.com/cloudcloudinary0/image/upload/v1730215431/proyecto-10-devscovery/assets/users_images/eremopt9chekpyvburqa.webp",
    favoriteEvents: []
  },
  {
    userName: "Lucia",
    email: "lucia@example.com",
    password: "Lucia123",
    role: "user",
    avatar:
      "https://res.cloudinary.com/cloudcloudinary0/image/upload/v1730215431/proyecto-10-devscovery/assets/users_images/xzhxifd0zhjwf6nyrkpv.webp",
    favoriteEvents: []
  },
  {
    userName: "Miguel",
    email: "miguel@example.com",
    password: "Miguel123",
    role: "user",
    avatar:
      "https://res.cloudinary.com/cloudcloudinary0/image/upload/v1730215431/proyecto-10-devscovery/assets/users_images/lflviztftu77konmpxlq.webp",
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
