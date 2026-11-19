const readline = require('readline');
const mongoose = require('mongoose');
const db = require('./services/dbservice.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(function(resolve) {
        rl.question(question, resolve);
    });
}

function printRecord(r) {
    console.log("--------------------------------------");
    console.log(`ID : ${r._id}`);
    console.log(`Item : ${r.itemName}`);
    console.log(`Category : ${r.category}`);
    console.log(`Quantity : ${r.quantity}`);
    console.log(`Weight (kg) : ${r.weightKg}`);
    console.log(`Points earned : ${r.points}`);
    console.log(`Facility : ${r.facility}`);
    console.log(`Date submitted: ${r.dateSubmitted}`);
    console.log(`Status : ${r.status}`);
}

function showMenu() {
    console.log("\n===== E-Waste Recycling Manager =====");
    console.log("1. Add a new recycling record");
    console.log("2. View all recycling records");
    console.log("3. Search for a recycling record by ID");
    console.log("4. Update an existing recycling record");
    console.log("5. Delete a recycling record");
    console.log("0. Exit");
}

async function addRecord() {
    let itemName = await ask("Item name: ");
    let category = await ask("Category (e.g. Laptop, Phone, Battery): ");
    let quantity = Number(await ask("Quantity: "));
    let weightKg = Number(await ask("Total weight (kg): "));
    let facility = await ask("Recycling facility: ");
    let dateSubmitted = await ask("Date submitted (DD/MM/YYYY): ");
    let status = await ask("Status (Pending / Collected / Recycled) [Pending]: ");

    try {
        let response = await db.addRecord(itemName, category, quantity, weightKg,
            facility, dateSubmitted, status || undefined);
        console.log(response);
    }
    catch(error) {
        console.log(error.message);
    }
}

function viewAllRecords() {
    return db.getAllRecords()
    .then(function(response) {
        if (response.length === 0) console.log("No recycling records found.");
        else response.forEach(printRecord);
    })
    .catch(function(error) {
        console.log(error.message);
    });
}

async function searchById() {
    let id = await ask("Enter record ID: ");
    try {
        let response = await db.getRecordById(id.trim());
        if (!response) console.log("No record found with that ID.");
        else printRecord(response);
    }
    catch(error) {
        console.log(error.message);
    }
}

async function updateRecord() {
    let id = (await ask("Enter ID of record to update: ")).trim();
    console.log("Press Enter to leave a field unchanged.");

    let itemName = await ask("New item name: ");
    let category = await ask("New category: ");
    let quantity = await ask("New quantity: ");
    let weightKg = await ask("New weight (kg): ");
    let facility = await ask("New facility: ");
    let dateSubmitted = await ask("New date submitted: ");
    let status = await ask("New status (Pending / Collected / Recycled): ");

    let updates = {};
    if (itemName) updates.itemName = itemName;
    if (category) updates.category = category;
    if (quantity) updates.quantity = Number(quantity);
    if (weightKg) updates.weightKg = Number(weightKg);
    if (facility) updates.facility = facility;
    if (dateSubmitted) updates.dateSubmitted = dateSubmitted;
    if (status) updates.status = status;

    if (Object.keys(updates).length === 0) {
        console.log("Nothing to update.");
        return;
    }

    try {
        let response = await db.updateRecordById(id, updates);
        console.log(response);
    }
    catch(error) {
        console.log(error.message);
    }
}

async function deleteRecord() {
    let id = (await ask("Enter ID of record to delete: ")).trim();
    try {
        let response = await db.deleteRecordById(id);
        console.log(response);
    }
    catch(error) {
        console.log(error.message);
    }
}

async function main() {
    try {
        let response = await db.connect();
        console.log(response);
    }
    catch(error) {
        console.log(error.message);
        rl.close();
        return;
    }

    let running = true;
    while (running) {
        showMenu();
        let choice = (await ask("Choose an option: ")).trim();

        switch (choice) {
            case '1': await addRecord(); break;
            case '2': await viewAllRecords(); break;
            case '3': await searchById(); break;
            case '4': await updateRecord(); break;
            case '5': await deleteRecord(); break;
            case '0': running = false; break;
            default: console.log("Invalid option. Please try again.");
        }
    }

    rl.close();
    await mongoose.disconnect();
    console.log("Goodbye!");
}

main();
