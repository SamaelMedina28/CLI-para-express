import { prisma } from "@lib/prisma.js";

export const ProductoService = {
    async getAll() {
        return await prisma.producto.findMany();
    },

    async getById(id: number) {
        return await prisma.producto.findUnique({
            where: { id },
        });
    },

    async create(data: any) {
        return await prisma.producto.create({
            data,
        });
    },

    async update(id: number, data: any) {
        return await prisma.producto.update({
            where: { id },
            data,
        });
    },

    async delete(id: number) {
        return await prisma.producto.delete({
            where: { id },
        });
    },
};
