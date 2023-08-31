import mongoose from 'mongoose'


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'please provide name'],
        maxLength: [100, 'name can not be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'please provide price'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'please provide product description'],
        maxLength : [1000, 'description can not exceed 1000 characters']
    },
    image: {
        type: String,
        default: '/uploads/example.jpeg'
    },
    category : {
        type: String,
        required: [true, 'please provide product category'],
        enum: ['office', 'kitchen', 'bedroom']
    },
    colors: {
        type: [String],
        required: true,
    },
    company: {
        type: String,
        required: [true, 'please provide product company'],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message : '{VALUE} is not supported'
        }
    },
    featured: {
        type: Boolean,
        default: false
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    inventory: {
        type: Number,
        required: true,
        default: 15,
    },
    averageRating: {
        type: Number, 
        default: 0
    },
    user : {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    }
    
},{timestamps: true})

export default mongoose.model('Product', ProductSchema);