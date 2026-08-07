import pkg from "@prisma/internals";
const { getDMMF } = pkg;

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname, basename } from "path";
import readline from "readline";

import { generateMiddleware } from "./templates/middleware.template.js";
import { generateController } from "./templates/controller.template.js";
import { generateService } from "./templates/service.template.js";
import { generateRoutes } from "./templates/routes.template.js";

// Utilidad para preguntar en consola si sobreescribimos
function askQuestion(query: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin as unknown as NodeJS.ReadableStream,
        output: process.stdout as unknown as NodeJS.WritableStream,
    });

    return new Promise((resolve) => {
        rl.question(`${query} (y/N): `, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === "y");
        });
    });
}

/**
 * Procesa la notación por puntos y banderas como -m
 */
function parsePathAndName(
    rawInput: string,
    defaultFolder: string,
    isModuleFlag: boolean,
) {
    // Reemplaza puntos por barras: "libro.libro" -> "libro/libro"
    const normalizedPath = rawInput.replace(/\./g, "/");

    // Extrae el nombre final del archivo: "libro"
    const rawFileName = basename(normalizedPath);

    // Extrae las subcarpetas: "libro"
    const subDirs = dirname(normalizedPath);

    // Formateamos las variaciones de nombre
    const nameUpper =
        rawFileName.charAt(0).toUpperCase() + rawFileName.slice(1);
    const nameLower =
        rawFileName.charAt(0).toLowerCase() + rawFileName.slice(1);

    // Si pasaron la bandera -m, la carpeta base cambia de "controllers" a "modules"
    const baseFolder = isModuleFlag ? "modules" : defaultFolder;

    // Construye la ruta final
    const targetDir =
        subDirs !== "."
            ? join(process.cwd(), "src", baseFolder, subDirs)
            : join(process.cwd(), "src", baseFolder);

    const relativePath =
        subDirs !== "."
            ? `${baseFolder}/${subDirs}/${nameLower}`
            : `${baseFolder}/${nameLower}`;

    return {
        targetDir,
        nameUpper,
        nameLower,
        relativePath,
    };
}

async function main() {
    const args = process.argv.slice(2);
    // Detectar si entre los argumentos viene la bandera -m o --module
    const isModuleFlag = args.includes("-m") || args.includes("--module");
    // Limpiamos los argumentos eliminando las banderas para no confundirlas con el nombre del archivo
    const cleanArgs = args.filter((arg) => !arg.startsWith("-"));
    const firstArg = cleanArgs[0];
    const secondArg = cleanArgs[1];
    if (!firstArg) {
        console.error(
            "[ERROR] Debes proporcionar un comando o nombre de modelo.",
        );
        console.log(`
        Uso de Vane CLI:
        pnpm vane <Modelo>                  (Ej: pnpm vane User -> genera todo)
        pnpm vane make:all <Modelo>         (Ej: pnpm vane make:all User)
        pnpm vane make:middleware <Nombre>  (Ej: pnpm vane make:middleware auth)
        pnpm vane make:controller <Nombre>  (Ej: pnpm vane make:controller Libro)
        pnpm vane make:service <Nombre>     (Ej: pnpm vane make:service Libro)
        pnpm vane make:routes <Nombre>      (Ej: pnpm vane make:routes Libro)
`);
        process.exit(1);
    }

    // Identificamos si se usó un subcomando como "make:middleware" o solo un modelo como "User"
    const isSubcommand = firstArg.startsWith("make:");
    const command = isSubcommand ? firstArg : "make:all";
    const rawName = isSubcommand ? secondArg : firstArg;

    if (!rawName) {
        console.error(
            `[ERROR] Debes indicar el nombre para el comando "${command}".`,
        );
        console.log(`-> Ejemplo: pnpm vane ${command} MiNombre`);
        process.exit(1);
    }

    switch (command) {
        case "make:all": {
            // 1. Validar contra prisma schema
            const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
            if (!existsSync(schemaPath)) {
                console.error(
                    "[ERROR] No se encontró el archivo prisma/schema.prisma",
                );
                process.exit(1);
            }

            const schema = readFileSync(schemaPath, "utf-8");
            const dmmf = await getDMMF({ datamodel: schema });

            const model = dmmf.datamodel.models.find(
                (m) => m.name.toLowerCase() === rawName.toLowerCase(),
            );

            if (!model) {
                console.error(
                    `[ERROR] No se encontró el modelo "${rawName}" en tu schema.prisma`,
                );
                process.exit(1);
            }

            const modelName = model.name; // Ej: "User"
            const modelLower =
                modelName.charAt(0).toLowerCase() + modelName.slice(1); // Ej: "user"

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

            console.log(
                `\n✨ [INFO] ¡Módulo ${modelName} generado con éxito!\n`,
            );
            break;
        }

        case "make:middleware": {
            const dir = join(process.cwd(), "src", "middlewares");
            if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

            const nameLower =
                rawName.charAt(0).toLowerCase() + rawName.slice(1);
            const filePath = join(dir, `${nameLower}.middleware.ts`);

            if (existsSync(filePath)) {
                console.warn(
                    `[WARNING] El middleware "${nameLower}" ya existe en src/middlewares/`,
                );
                const shouldOverwrite = await askQuestion(
                    "¿Deseas sobreescribirlo?",
                );
                if (!shouldOverwrite) {
                    console.log("[INFO] Operación cancelada.");
                    process.exit(0);
                }
            }

            writeFileSync(filePath, generateMiddleware(rawName), "utf-8");
            console.log(
                `\n✅ [INFO] Middleware creado con éxito en: src/middlewares/${nameLower}.middleware.ts\n`,
            );
            break;
        }

        case "make:controller": {
            const { targetDir, nameUpper, nameLower, relativePath } =
                parsePathAndName(rawName, "controllers", isModuleFlag);

            if (!existsSync(targetDir))
                mkdirSync(targetDir, { recursive: true });

            const filePath = join(targetDir, `${nameLower}.controller.ts`);

            if (existsSync(filePath)) {
                console.warn(
                    `[WARNING] El controller en "${relativePath}.controller.ts" ya existe.`,
                );
                const shouldOverwrite = await askQuestion(
                    "¿Deseas sobreescribirlo?",
                );
                if (!shouldOverwrite) {
                    console.log("[INFO] Operación cancelada.");
                    process.exit(0);
                }
            }

            writeFileSync(filePath, generateController(nameUpper), "utf-8");
            console.log(
                `\n✅ [INFO] Controller creado en: src/${relativePath}.controller.ts\n`,
            );
            break;
        }
        case "make:service":
        case "make:routes": {
            console.log(`[INFO] Comando ${command} recibido para: ${rawName}`);
            // (Pendiente)
            break;
        }

        default:
            console.error(`[ERROR] Comando no reconocido: ${command}`);
            process.exit(1);
    }
}

main();
