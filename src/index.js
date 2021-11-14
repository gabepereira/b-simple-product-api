const app = require("./app");

const { PORT = 3001 } = process.env;

app.listen(PORT, () =>
  console.log("Server listening on http://localhost:%s", PORT)
);
