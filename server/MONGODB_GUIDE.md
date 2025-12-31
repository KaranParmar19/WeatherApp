# Getting Started with MongoDB

## 1. Introduction to MongoDB
MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

**Key Features:**
- **Document Model:** Data is stored in documents (JSON-style) rather than rows and columns.
- **Scalability:** Built for high availability and horizontal scaling.
- **Flexible Schema:** Documents in the same collection do not need to have the same set of fields.

## 2. Installation
To use MongoDB locally, you need to install the MongoDB Community Server and the MongoDB Shell (mongosh).

### Database Server
1. Download MongoDB Community Server from the [official website](https://www.mongodb.com/try/download/community).
2. Follow the installation wizard for your OS (Windows/macOS/Linux).
3. Ensure the MongoDB service is running.

### MongoDB Shell (mongosh)
1. Download `mongosh` from the [Download Center](https://www.mongodb.com/try/download/shell).
2. Extract and add the bin folder to your system PATH.
3. Run `mongosh` in your terminal to connect.

## 3. MongoDB Terminology
| Relational DB (SQL) | MongoDB (NoSQL) | Description |
|---------------------|-----------------|-------------|
| Database            | Database        | Container for collections. |
| Table               | Collection      | Group of MongoDB documents. |
| Row                 | Document        | A set of key-value pairs (JSON object). |
| Column              | Field           | A specific data point within a document. |

## 4. MongoDB Shell Commands
Open your terminal and type `mongosh` to enter the shell.

### Basic Commands
- **Show Databases:** `show dbs`
- **Use Database:** `use weatherapp` (Creates if it doesn't exist when you save data)
- **Create Collection:** `db.createCollection("users")` (Optional, happens automatically on insert)
- **Drop Collection:** `db.users.drop()`
- **Drop Database:** `db.dropDatabase()`

### CRUD Operations (Data Manipulation)

**1. Insert (Create through Shell)**
```javascript
db.users.insertOne({ name: "Ayush", city: "Delhi", age: 25 })
```

**2. Find (Read)**
```javascript
db.users.find() // Find all
db.users.find({ city: "Delhi" }) // Find specific
```

**3. Update**
```javascript
db.users.updateOne(
  { name: "Ayush" },
  { $set: { city: "Mumbai" } }
)
```

**4. Delete**
```javascript
db.users.deleteOne({ name: "Ayush" })
```

## 5. Connect MongoDB using Node.js (Mongoose)
(Already implemented in this project)

**1. Connection (`config/db.js`)**
Uses `mongoose.connect(process.env.MONGO_URI)` to establish a connection.

**2. Schema Integration (`models/User.js`)**
Mongoose allows us to define strict schemas for our flexible MongoDB documents.
```javascript
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    // ...
});
```

**3. CRUD in Node.js (`routes/auth.js`)**
- **Create:** `await User.create({ email, ... })`
- **Read:** `await User.findOne({ email })`
- **Update:** `await User.updateOne(...)` (Not yet implemented in routes, but available)
- **Delete:** `await User.deleteOne(...)`
