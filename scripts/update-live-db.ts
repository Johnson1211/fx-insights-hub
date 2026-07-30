import prisma from "../lib/prisma";

async function main() {
  console.log("Connecting directly to Supabase PostgreSQL database...");

  console.log("Step 1: Adding 'superadmin' to PostgreSQL Role enum if present...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'superadmin';`);
    console.log("Enum updated successfully.");
  } catch (err: any) {
    console.log("Enum step note:", err.message);
  }

  console.log("Step 2: Converting User.role column to text...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "role" TYPE text USING "role"::text;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'guest';`);
    console.log("Column 'role' converted to text successfully.");
  } catch (err: any) {
    console.log("Column step note:", err.message);
  }

  console.log("Step 3: Setting user benjaminjohnson750@gmail.com to superadmin...");
  const result = await prisma.$executeRawUnsafe(`UPDATE "User" SET role = 'superadmin' WHERE email = 'benjaminjohnson750@gmail.com';`);
  console.log("Updated rows count:", result);

  console.log("\n🎉 LIVE DATABASE SUCCESSFULLY MIGRATED AND UPDATED!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Live DB script error:", err);
  process.exit(1);
});
