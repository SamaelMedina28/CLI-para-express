import { z } from "zod";

/**
 * Esquema de validación para la creación de Producto
 */
export const createProductoSchema = z.object({
    nombre: z.string(),
    precio: z.number(),
    stock: z.number().int(),
    activo: z.boolean(),
    descripcion: z.string().optional(),
});

/**
 * Esquema de validación para actualización (todos los campos opcionales)
 */
export const updateProductoSchema = createProductoSchema.partial();

// Tipos inferidos de TypeScript
export type CreateProductoInput = z.infer<typeof createProductoSchema>;
export type UpdateProductoInput = z.infer<typeof updateProductoSchema>;
