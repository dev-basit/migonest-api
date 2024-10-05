exports.logMiddleware = (req, res, next) => {
  console.log("\n");
  console.log(`${req.method} ${req.originalUrl}`);
  console.log(`Params:         ${JSON.stringify(req.query)}`);
  console.log(`Body:           ${JSON.stringify(req.body)}`);
  console.log(`Api Consumer:   ${JSON.stringify(req.user || {})}`);

  const start = Date.now();
  res.on("finish", () => {
    console.log(`HTTP Response Status: ${res.statusCode}`);
    console.log(`Time taken:  ${(Date.now() - start) / 1000} seconds`);
  });

  next();
};
