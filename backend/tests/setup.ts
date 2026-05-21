process.env.NODE_ENV = "test";

import { prisma } from "../src/prisma/prisma.client.js";

afterAll(async () => {
  await prisma.$disconnect();
});