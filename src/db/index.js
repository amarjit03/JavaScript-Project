import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


/*
mongoose.connect() is used to establish a connection between your Node.js application and a MongoDB database. It takes a connection string (URI) and optional settings, and returns a promise.

We use await with it because it’s an asynchronous operation — connecting to the database might take time, especially if the database is hosted remotely (e.g., in another region or on a cloud provider). Using await ensures that:

The function waits for the connection to be established before continuing.

We can handle connection success or failure properly using try-catch.


If process.env.MONGODB_URI is undefined, the connection string passed to mongoose.connect() becomes invalid — something like:

mongoose.connect("undefined/your-db-name");

This will cause Mongoose to fail to connect, triggering the catch block. As a result:

The message MongoDB connection FAIL: along with the error details will be logged.

Then, process.exit(1) will terminate the application immediately with a non-zero exit code (indicating failure).


Appending /${DB_NAME} to process.env.MONGODB_URI using a constant like DB_NAME (imported from a constants.js file) makes the code more modular, readable, and maintainable.

Reasons this is a good practice:

If the database name changes (e.g., switching from dev_db to prod_db), you only need to update it in one place.

It prevents duplication of values throughout the codebase.

Makes the code easier to configure across environments (dev, staging, production).

Follows the DRY principle (Don’t Repeat Yourself).



*/

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`\nMongoDB connected 🚀 DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection FAIL:", error);
    process.exit(1);
  }
};

export default connectDB;

