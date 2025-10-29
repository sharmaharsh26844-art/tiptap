import 'dotenv/config';
import bcrypt from "bcryptjs";
import dbConnect from "./lib/mongodb.js";
import Supporter from "./models/Supporter.js";

async function fixPasswords() {
  await dbConnect();

  const supporters = await Supporter.find({
    $or: [{ password: { $exists: false } }, { password: null }, { password: "" }]
  });

  console.log(`Found ${supporters.length} supporters without password.`);

  for (const supporter of supporters) {
    const defaultPassword = "ChangeMe123!";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    supporter.password = hashedPassword;
    supporter.mustChangePassword = true; // force change on next login
    await supporter.save();

    console.log(`Password set for ${supporter.email} → ${defaultPassword}`);
  }

  console.log("All missing passwords fixed.");
  process.exit(0);
}

fixPasswords().catch(err => {
  console.error(err);
  process.exit(1);
});
