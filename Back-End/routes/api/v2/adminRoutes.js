import express from "express";
import fs from "fs";
import path from "path";
import {authorize, authenticate} from "../../../middlewares/auth.js";

const router = express.Router();

const logsDir = path.join(process.cwd(), "logs");





router.get("/logs", authenticate, authorize(["admin"]), async (req, res) => {
    try {
        const files = fs
            .readdirSync(logsDir)
            .filter((file) => file.endsWith(".log"))
            .sort()
            .reverse();

        if (files.length === 0) {
            return res.status(404).json({ message: "No log files found" });
        }

        // Lire le dernier fichier de logs (le plus récent)
        const latestLogFile = path.join(logsDir, files[0]);
        const data = fs.readFileSync(latestLogFile, "utf8");

        // garde les 100 dernières lignes pour ne pas surcharger la réponse
        const lines = data.trim().split("\n");
        const lastLines = lines.slice(-100);

        res.json({
            file: files[0],
            logs: lastLines,
        });
    } catch (error) {
        console.error("Error reading logs:", err);
        res.status(500).json({ message: "Error while reading log files" });
    }
});

export default router;
