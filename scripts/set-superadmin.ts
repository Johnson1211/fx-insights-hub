import prisma from "../lib/prisma";

async function main() {
  const email = process.argv[2] || "benjaminjohnson750@gmail.com";

  console.log("Ensuring 'superadmin' exists in PostgreSQL 'Role' enum...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'superadmin';`);
    console.log("PostgreSQL enum updated successfully.");
  } catch (err: any) {
    console.log("Enum update note:", err.message);
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
    data: { role: "superadmin" as any },
  });

  console.log(`\n🎉 SUCCESS! User "${updated.name}" (${updated.email}) has been set to SUPERADMIN (System Owner).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error setting superadmin:", err);
  process.exit(1);
});
