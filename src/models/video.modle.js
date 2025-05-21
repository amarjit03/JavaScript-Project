import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videSchema = new Schema(
    {
        videoFile:{
            type:String, //cloudnry url
            requried:true
        },
        thumbnail:{
            type:String, //cloudnry url
            requried:true
        },
        title:{
            type:String, 
            requried:true
        },
        description:{
            type:String, 
            requried:true
        },
        duration:{
            type:Number, //cloudnry url
            requried:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:True
        },
        owner:{
            types:Schema.type.ObjectId,
            ref:"User"
        }
    }
)


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videSchema)