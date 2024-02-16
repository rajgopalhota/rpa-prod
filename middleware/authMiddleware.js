const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    
    const token = req.headers.authorization.split(" ")[1];
    
    const decodedToken = jwt.verify(token, "your-secret-key");

    // Fetch the user based on the decoded token
    const user = await UserModel.findById(decodedToken.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach the user object to the request for further use in the route handlers
    req.user = user;

    next();
    
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
