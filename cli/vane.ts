import pkg from "@prisma/internals";
const { getDMMF } = pkg;
// TODO: refactorizar todo para no tener todo en un solo archivo
// TODO: verificar que al momento de crear archivos INDIVIDUALES las rutas de importacion aun funcionen

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

import { generateMiddleware } from "./templates/middleware.template.js";
import { generateController } from "./templates/controller.template.js";
import { generateService } from "./templates/service.template.js";
import { generateRoutes } from "./templates/routes.template.js";
import { generateSchema } from "./templates/schema.template.js";
import { askQuestion } from "./utils/prompt.util.js";
import { parsePathAndName } from "./utils/path.util.js";


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
                modelName.charAt(0).toLowerCase() + modelName.slice(1);

            // 2. Definir rutas de salida
            const moduleDir = join(process.cwd(), "src", "modules", modelLower);

            // 3. Control de sobreescritura
            if (existsSync(moduleDir)) {
                console.warn(
                    `[WARNING] El módulo "${modelLower}" ya existe en src/modules/${modelLower}`,
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

            // 4. Generar y escribir archivos (AHORA INCLUYE SCHEMA DINÁMICO)
            const filesToGenerate = [
                {
                    path: join(moduleDir, `${modelLower}.schema.ts`),
                    content: generateSchema(modelName, model.fields),
                    name: "Schema",
                },
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
        case "make:service": {
            const { targetDir, nameUpper, nameLower, relativePath } =
                parsePathAndName(rawName, "services", isModuleFlag);

            if (!existsSync(targetDir))
                mkdirSync(targetDir, { recursive: true });

            const filePath = join(targetDir, `${nameLower}.service.ts`);

            if (existsSync(filePath)) {
                console.warn(
                    `[WARNING] El service en "${relativePath}.service.ts" ya existe.`,
                );
                const shouldOverwrite = await askQuestion(
                    "¿Deseas sobreescribirlo?",
                );
                if (!shouldOverwrite) {
                    console.log("[INFO] Operación cancelada.");
                    process.exit(0);
                }
            }

            writeFileSync(filePath, generateService(nameUpper), "utf-8");
            console.log(
                `\n✅ [INFO] Service creado en: src/${relativePath}.service.ts\n`,
            );
            break;
        }

        case "make:routes": {
            const { targetDir, nameUpper, nameLower, relativePath } =
                parsePathAndName(rawName, "routes", isModuleFlag);

            if (!existsSync(targetDir))
                mkdirSync(targetDir, { recursive: true });

            const filePath = join(targetDir, `${nameLower}.routes.ts`);

            if (existsSync(filePath)) {
                console.warn(
                    `[WARNING] El archivo de rutas en "${relativePath}.routes.ts" ya existe.`,
                );
                const shouldOverwrite = await askQuestion(
                    "¿Deseas sobreescribirlo?",
                );
                if (!shouldOverwrite) {
                    console.log("[INFO] Operación cancelada.");
                    process.exit(0);
                }
            }

            writeFileSync(filePath, generateRoutes(nameUpper), "utf-8");
            console.log(
                `\n✅ [INFO] Routes creado en: src/${relativePath}.routes.ts\n`,
            );
            break;
        }

        default:
            console.error(`[ERROR] Comando no reconocido: ${command}`);
            process.exit(1);
    }
}

main();
