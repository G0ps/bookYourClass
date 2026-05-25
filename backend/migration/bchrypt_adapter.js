import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
    console.log("❌ Please provide a password");
    console.log("👉 Example: node hash.js myPassword123");
    process.exit(1);
}

const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

const run = async () => {
    const hashed = await hashPassword(password);
    console.log("🔐 Hashed Password:");
    console.log(hashed);
};

run();