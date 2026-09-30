// Must be the first import so env vars are loaded before app.js reads them.
import "dotenv/config";
import dbConn from "./config/DBconnect.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Database Connection
dbConn();

// Start Server
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is running on port ${PORT}`)
);
