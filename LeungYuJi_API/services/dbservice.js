const mongoose = require('mongoose');
const recyclingRecord = require("../models/recyclingrecord.js");

let db = {

    async connect() {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/ewasteRecyclingDB');
            return "Connected to Mongo DB";
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error connecting to Mongo DB");
        }
    },

    async addRecord(itemName, category, quantity, weightKg, facility, dateSubmitted, status) {
        try {
            let result = await recyclingRecord.create({
                itemName: itemName,
                category: category,
                quantity: quantity,
                weightKg: weightKg,
                facility: facility,
                dateSubmitted: dateSubmitted,
                status: status
            });
            return `Record added with ID: ${result._id}. You earned ${result.points} points!`;
        }
        catch(e) {
            console.log(e.message);
            throw new Error(`Record for ${itemName} was not added.`);
        }
    },

    async getAllRecords() {
        try {
            let results = await recyclingRecord.find();
            return results;
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error retrieving records");
        }
    },

    async getRecordById(id) {
        try {
            let result = await recyclingRecord.findById(id);
            return result;
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error retrieving record");
        }
    },

    async updateRecordById(id, updates) {
        try {
            let result = await recyclingRecord.findByIdAndUpdate(id, updates, { runValidators: true });
            if (!result) return "Unable to find record to update.";
            else return "Record is updated!";
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error updating record");
        }
    },

    async deleteRecordById(id) {
        try {
            let result = await recyclingRecord.findByIdAndDelete(id);
            if (!result) return "Unable to find a record to delete.";
            else return "Record is deleted!";
        }
        catch(e) {
            console.log(e.message);
            throw new Error("Error deleting record");
        }
    }
};

module.exports = db;
