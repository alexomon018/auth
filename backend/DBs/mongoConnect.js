import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_DOCKER_URI}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB is connected on: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
