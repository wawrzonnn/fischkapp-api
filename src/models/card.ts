import mongoose from 'mongoose';

 export const cardSchema = new mongoose.Schema({
   front: {
       type: String,
       required: true,
       unique: true  
   },
   back: {
       type: String,
       required: true
   },
   tags: [String],
   author: {
       type: String,
       required: true
   },
   createdAt: { 
       type: Date,
       default: Date.now
   }
});

export const Card = mongoose.model('Card', cardSchema);