import "dotenv/config";
import app from "./app.js";
import { dbConnection } from "./config/dbConnection.js";
import logger from "./utils/logger.js";
dbConnection();
app.listen(process.env.PORT, () => {
  logger.info(`Server running on PORT:${process.env.PORT}`);
});
