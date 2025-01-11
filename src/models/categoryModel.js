import mongoose,{Schema} from "mongoose";


const categorySchema = new Schema({
    title:{
        required:true,
        type:String
    },

    imageUrl:{
        type:String,
        default:"https://images.app.goo.gl/R4jgJxe8rrw7ficx7"
    }
},{timestamps:true});



const Category = mongoose.model("Category",categorySchema)
export default Category
