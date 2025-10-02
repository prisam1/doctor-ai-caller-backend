exports.setAuthCookies = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "None",
    maxAge: 2 * 24 * 60 * 60 * 1000,
    secure: true,
  };

  res.cookie("access_token", token, cookieOptions);
};
