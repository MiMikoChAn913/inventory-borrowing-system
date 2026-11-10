import "../src/config.js";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const required = (name) => {
  const value = process.env[name];
  if (!value || value.length < 8) throw new Error(`${name} must be set and at least 8 characters.`);
  return value;
};

const main = async () => {
  const borrowerEmail = process.env.SEED_BORROWER_EMAIL ?? "borrower@example.test";
  const custodianEmail = process.env.SEED_CUSTODIAN_EMAIL ?? "custodian@example.test";
  const borrowerPassword = required("SEED_BORROWER_PASSWORD");
  const custodianPassword = required("SEED_CUSTODIAN_PASSWORD");

  await prisma.user.upsert({
    where: { email: borrowerEmail.toLowerCase() },
    update: {},
    create: {
      email: borrowerEmail.toLowerCase(),
      displayName: "Demo Borrower",
      passwordHash: await bcrypt.hash(borrowerPassword, 12),
      role: "BORROWER",
    },
  });
  await prisma.user.upsert({
    where: { email: custodianEmail.toLowerCase() },
    update: {},
    create: {
      email: custodianEmail.toLowerCase(),
      displayName: "Demo Custodian",
      passwordHash: await bcrypt.hash(custodianPassword, 12),
      role: "CUSTODIAN",
    },
  });

  if ((await prisma.item.count()) === 0) {
    await prisma.item.createMany({
      data: [
        { name: "Notebook computer", description: "Portable computer for coursework", totalQuantity: 5, availableQuantity: 5 },
        { name: "Projector", description: "HDMI projector with power cable", totalQuantity: 2, availableQuantity: 2 },
        { name: "Arduino kit", description: "Microcontroller learning kit", totalQuantity: 10, availableQuantity: 10 },
      ],
    });
  }

  console.log("Seed completed. Demo credentials came from environment variables.");
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
