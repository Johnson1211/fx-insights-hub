import prisma from "../lib/prisma";

async function main() {
  const email = process.argv[2] || "benjaminjohnson750@gmail.com";

  console.log("Converting PostgreSQL 'User.role' column to text...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "role" TYPE text USING "role"::text;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'guest';`);
    console.log("PostgreSQL column 'role' converted to text successfully.");
  } catch (err: any) {
    console.log("Column alter note:", err.message);
  }

  console.log(`\nSearching for user with email: ${email}...`);
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.error(`User with email "${email}" not found in database.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: "superadmin" },
  });

  console.log(`\n🎉 SUCCESS! User "${updated.name}" (${updated.email}) role is set to SUPERADMIN (System Owner).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error setting superadmin:", err);
  process.exit(1);
});
