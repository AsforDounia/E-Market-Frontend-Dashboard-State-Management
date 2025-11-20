// seeds/reset-db.js
import mongoose from "mongoose";
import seedDatabase from "./seed.js";
import DotenvFlow from "dotenv-flow";

DotenvFlow.config({ node_env: "production", override: true });

async function resetDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database");

        // The seedDatabase function now handles clearing the collections.
        await seedDatabase();
        console.log("Database reset completed");

        await mongoose.disconnect();
    } catch (err) {
        console.error("Reset failed:", err);
        process.exit(1);
    }
}

resetDatabase();
