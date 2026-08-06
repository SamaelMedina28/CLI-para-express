import { prisma } from "@lib/prisma.js";

export const LibroService = {
    async getAll() {
        return await prisma.libro.findMany();
    },

    async getById(id: number) {
        return await prisma.libro.findUnique({
            where: { id },
        });
    },

    async create(data: any) {
        return await prisma.libro.create({
            data,
        });
    },

    async update(id: number, data: any) {
        return await prisma.libro.update({
            where: { id },
            data,
        });
    },

    async delete(id: number) {
        return await prisma.libro.delete({
            where: { id },
        });
    },
};
