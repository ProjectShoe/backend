module.exports = {
  secret: process.env.JWT_SECRET || "your_jwt_secret",
  accessTokenLife: "7d",
  refreshTokenLife: "7d",
};
