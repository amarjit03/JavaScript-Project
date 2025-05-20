// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:'./env'
})

connectDB()
.then(() => {
    app.listen(process.env.port || 8000), () => {
        console.log(`server running on port : 
            ${process.env.PORT}`);
        
    }
})
.catch((err) => {
    console.log("MONGODB connection error",err);
    

})




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







