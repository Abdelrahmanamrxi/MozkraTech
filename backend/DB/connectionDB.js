import mongoose from "mongoose"

const connectToDB = async () => {
    await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connect to DB..");
    })
    .catch((err) => {
      console.log(`three is error to connect to DB ${err}`);
    });
}
export default connectToDB