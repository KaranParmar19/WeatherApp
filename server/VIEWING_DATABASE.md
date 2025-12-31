# How to View Your Database Data

Here are 3 ways to see the data inside your MongoDB database.

## Method 1: Quick Script (Recommended)
I have added a shortcut command to your server project.

1. Open a new terminal.
2. Go to the server directory:
   ```bash
   cd server
   ```
3. Run the following command:
   ```bash
   npm run db:users
   ```
   *This will print a list of all registered users (Email & Username) to your terminal.*

## Method 2: MongoDB Compass (GUI)
If you prefer a visual interface (like Excel/Tables):
1. Download and install **MongoDB Compass**.
2. Open Compass and connect to: `mongodb://127.0.0.1:27017`
3. In the sidebar, look for the `weatherapp` database.
4. Click on the `users` collection to see all documents.

## Method 3: Command Line (mongosh)
For advanced control:
1. Open your terminal and type:
   ```bash
   mongosh
   ```
2. Switch to your database:
   ```javascript
   use weatherapp
   ```
3. Show all users:
   ```javascript
   db.users.find()
   ```
   *(Add `.pretty()` at the end for better formatting if using an older shell)*
