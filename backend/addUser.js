// MongoDB shell script to add user
db = db.getSiblingDB('infratrack');

db.users.insertOne({
  "organizationId": "SA-GOV-001",
  "name": "Mohammed Daniyal",
  "email": "mohammeddaniyal21@gmail.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye.IQ661.XSJIMei1LLqCzEma0JT8SDOy",
  "role": "Admin",
  "department": "Infrastructure",
  "status": "active",
  "lastLogin": null,
  "createdAt": new Date(),
  "updatedAt": new Date()
});

print("✅ User added successfully!");
