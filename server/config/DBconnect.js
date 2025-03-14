import mongoose from "mongoose";
const dbConn = async () => {
  try {
    console.log(`Connecting to the DB`,process.env.DATABASE_URL)
    const dbConnect=await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to DB",dbConnect.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default dbConn;
