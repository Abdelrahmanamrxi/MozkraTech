import mongoose from "mongoose"

const connectToDB = async () => {
    await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connecting to DB..");
    })
    .catch((err) => {
      console.log(`three is error to connect to DB ${err}`);
    });
}
export default connectToDB