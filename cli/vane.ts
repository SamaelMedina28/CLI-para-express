import pkg from "@prisma/internals";
const { getDMMF } = pkg;

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import readline from "readline";

import { generateController } from "./templates/controller.template.js";
import { generateService } from "./templates/service.template.js";
import { generateRoutes } from "./templates/routes.template.js";

// Utilidad para preguntar en consola si sobreescribimos
function askQuestion(query: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(`${query} (y/N): `, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === "y");
        });
    });
}

async function main() {
    const args = process.argv.slice(2);
    const rawModelName = args[0];

    if (!rawModelName) {
        console.error("[ERROR] Debes indicar el nombre del modelo.");
        console.log("-> Ejemplo: pnpm vane User");
        process.exit(1);
    }

    // 1. Validar contra prisma schema
    const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
    if (!existsSync(schemaPath)) {
        console.error("[ERROR] No se encontró el archivo prisma/schema.prisma");
        process.exit(1);
    }

    const schema = readFileSync(schemaPath, "utf-8");
    const dmmf = await getDMMF({ datamodel: schema });

    const model = dmmf.datamodel.models.find(
        (m) => m.name.toLowerCase() === rawModelName.toLowerCase(),
    );

    if (!model) {
        console.error(
            `[ERROR] No se encontró el modelo "${rawModelName}" en tu schema.prisma`,
        );
        process.exit(1);
    }

    const modelName = model.name; // Ej: "User"
    const modelLower = modelName.charAt(0).toLowerCase() + modelName.slice(1); // Ej: "user"

    // 2. Definir rutas de salida (src/modules/user)
    const moduleDir = join(process.cwd(), "src", "modules", modelLower);

    // 3. Control de sobreescritura
    if (existsSync(moduleDir)) {
        console.warn(
            `[WARNING]  El módulo "${modelLower}" ya existe en src/modules/${modelLower}`,
        );
        const shouldOverwrite = await askQuestion(
            "¿Deseas sobreescribir los archivos existentes?",
        );

        if (!shouldOverwrite) {
            console.log("[INFO] Operación cancelada.");
            process.exit(0);
        }
    } else {
        mkdirSync(moduleDir, { recursive: true });
    }

    // 4. Generar y escribir archivos
    const filesToGenerate = [
        {
            path: join(moduleDir, `${modelLower}.controller.ts`),
            content: generateController(modelName),
            name: "Controller",
        },
        {
            path: join(moduleDir, `${modelLower}.service.ts`),
            content: generateService(modelName),
            name: "Service",
        },
        {
            path: join(moduleDir, `${modelLower}.routes.ts`),
            content: generateRoutes(modelName),
            name: "Routes",
        },
    ];

    console.log(`\n[INFO] Generando módulo para: ${modelName}...`);

    for (const file of filesToGenerate) {
        writeFileSync(file.path, file.content, "utf-8");
        console.log(
            `  ✅ [INFO] Archivo creado: src/modules/${modelLower}/${file.name.toLowerCase()}.ts`,
        );
    }

    console.log(`\n✨ [INFO] ¡Módulo ${modelName} generado con éxito!\n`);
}

main();
