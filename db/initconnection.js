import mongoose from "mongoose";

const initconnection =()=>{
mongoose.connect('mongodb+srv://ayataha8882:j8rq0GRcwpK4dQll@cluster0.fnzdbje.mongodb.net/')

.then(()=>console.log("DB connected"))
.catch((err)=>console.log("error", err))
}

export default initconnection;