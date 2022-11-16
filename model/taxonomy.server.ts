import type { Taxonomy } from "@prisma/client";
import { prisma } from "~/utils/prisma.server";

export const createTaxonomy = async (taxonomy: Taxonomy) => {
  return prisma.taxonomy.create({
    data: { ...taxonomy, isApproved: false },
  });
};

//get all taxonomies
export const getTaxonomies = async () => {
  return await prisma.taxonomy.findMany({});
};

export async function setApprove(id: string) {
  return prisma.taxonomy.update({
    where: { id: id },
    data: { isApproved: true },
  });
}

export async function getUserTaxonomy(username: string) {
  return prisma.taxonomy.findMany({
    where: { username },
  });
}

export async function getApprovedTaxonomy() {
  return prisma.taxonomy.findMany({
    where: { isApproved: true },
  });
}
