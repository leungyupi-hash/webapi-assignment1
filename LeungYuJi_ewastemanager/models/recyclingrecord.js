const mongoose = require('mongoose');

const POINTS_PER_KG = 10;   

const recyclingRecordSchema = mongoose.Schema({
    itemName: { type: String, required: true },
    category: String,           
    quantity: { type: Number, min: 1 },
    weightKg: { type: Number, min: 0 },
    facility: String,          
    dateSubmitted: String,      
    status: {
        type: String,
        enum: ['Pending', 'Collected', 'Recycled'],
        default: 'Pending'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

recyclingRecordSchema.virtual('points').get(function() {
    return Number(((this.weightKg || 0) * POINTS_PER_KG).toFixed(2));
});

module.exports = mongoose.model('recyclingrecords', recyclingRecordSchema);
