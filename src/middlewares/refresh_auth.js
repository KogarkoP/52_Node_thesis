import jwt from "jsonwebtoken";

const authRefresh = (req, res, next) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Authorization problems (no token)",
    });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded;

    next();
  });
};

export default authRefresh;
