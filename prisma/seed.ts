import { prisma } from "~/utils/prisma.server";

async function seed() {
  prisma.taxonomy.create({
    data: {
      rank: "species",
      isApproved: false,
      username: "admin",
      credit: "none",
      info: "none",
      taxonomyName: "Haliaeetus vocifer",
      englishName: "African fish eagle",
    },
  });
}
seed()
  .then(() => {
    console.log("Seeds");
  })
  .catch((e) => {
    console.error(e);
  });
