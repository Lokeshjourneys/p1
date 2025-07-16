import mongoose ,{schema} from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type:Schema.Types.ObjectId,// Reference to the User model
        ref: 'User',
    },
    channel: {
        type: Schema.Types.ObjectId, // Reference to the User model (channel owner)
        ref: 'User',
    }
},
{
    timestamps: true,}
)






export const Subscription = mongoose.model('Subscription', subscriptionSchema);