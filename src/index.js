// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:'./env'
})

connectDB()




// dotenv.config();

// const app = express();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log("MongoDB connected");

//         app.on("error", (err) => {
//             console.error("App Error:", err);
//             throw err;
//         });

//         app.listen(process.env.PORT, () => {
//             console.log(`App listening on port ${process.env.PORT}`);
//         });

//     } catch (error) {
//         console.error("Startup Error:", error);
//         process.exit(1);  
//     }
// })();







