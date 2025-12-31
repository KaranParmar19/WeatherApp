import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';

// Helper for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Logger extends EventEmitter {
    constructor() {
        super();
        this.logDir = path.join(__dirname, '../logs');
        this.logFile = path.join(this.logDir, 'access.log');

        // Ensure log directory exists
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }

        // Create a writable stream to the log file (append mode)
        this.logStream = fs.createWriteStream(this.logFile, { flags: 'a' });

        // Event listener for internal logging logic
        this.on('log', (message) => {
            this.writeLog(message);
        });
    }

    writeLog(message) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] ${message}\n`;

        // Write to stream
        this.logStream.write(formattedMessage);

        // Also log to console
        console.log(`[LOGED]: ${message}`);
    }

    // Public method to trigger the log event
    log(message) {
        this.emit('log', message);
    }
}

const logger = new Logger();
export default logger;
