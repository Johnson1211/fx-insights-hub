import prisma from "../lib/prisma";

async function main() {
  const emails = ["fxinsighth@gmail.com", "benjaminjohnson750@gmail.com"];

  console.log("Connecting directly to Supabase PostgreSQL database...");

  console.log("Step 1: Adding 'superadmin' to PostgreSQL Role enum if present...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'superadmin';`);
  } catch (err: any) {}

  console.log("Step 2: Converting User.role column to text...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "role" TYPE text USING "role"::text;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'guest';`);
  } catch (err: any) {}

  console.log("Step 3: Promoting specified email accounts to superadmin...");
  for (const email of emails) {
    const res = await prisma.$executeRawUnsafe(
      `UPDATE "User" SET role = 'superadmin' WHERE LOWER(email) = LOWER('${email}');`
    );
    console.log(`Updated user ${email}: ${res} row(s) updated.`);
  }

  console.log("\n🎉 LIVE DATABASE SUCCESSFULLY UPDATED FOR SUPERADMIN ACCOUNTS!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Live DB script error:", err);
  process.exit(1);
});
