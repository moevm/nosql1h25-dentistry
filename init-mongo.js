db = db.getSiblingDB('dentistry_db');
db.createUser({
    user: "admin",
    pwd: "your_secure_password",
    roles: [
        { role: "readWrite", db: "dentistry_db" }
    ]
});