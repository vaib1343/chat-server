const User = require("../models/user.model");
const {
  getHashPassword,
  verifyPassword,
  generateToken,
} = require("../utils/auth.utils");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashPassword = await (await getHashPassword(password)).toString();

      const user = new User({ email, hashPassword });
      const userSaved = await user.save();

      res.status(200).json({ message: "successfully saved", data: userSaved });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "CORS ERROR" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found", success: false });
      }
      const verify = await verifyPassword(password, user.hashPassword);
      if (!verify) {
        return res
          .status(400)
          .json({ message: "User not found", success: false });
      }
      const token = generateToken(email);
      res
        .status(200)
        .json({ message: "logged In", success: true, token: token });
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "CORS ERROR" });
    }
  },
};
