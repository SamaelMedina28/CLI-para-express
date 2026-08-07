import { handleMakeAll } from "./commands/make-all.command.js";
import { handleMakeController } from "./commands/make-controller.command.js";
import { handleMakeService } from "./commands/make-service.command.js";
import { handleMakeRoutes } from "./commands/make-routes.command.js";
import { handleMakeMiddleware } from "./commands/make-middleware.command.js";

async function main() {
    const args = process.argv.slice(2);
    const isModuleFlag = args.includes("-m") || args.includes("--module");
    const cleanArgs = args.filter((arg) => !arg.startsWith("-"));
    
    const firstArg = cleanArgs[0];
    const secondArg = cleanArgs[1];

    if (!firstArg) {
        console.error("[ERROR] Debes proporcionar un comando o nombre de modelo.");
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

    const isSubcommand = firstArg.startsWith("make:");
    const command = isSubcommand ? firstArg : "make:all";
    const rawName = isSubcommand ? secondArg : firstArg;

    if (!rawName) {
        console.error(`[ERROR] Debes indicar el nombre para el comando "${command}".`);
        console.log(`-> Ejemplo: pnpm vane ${command} MiNombre`);
        process.exit(1);
    }

    switch (command) {
        case "make:all":
            await handleMakeAll(rawName);
            break;
        case "make:middleware":
            await handleMakeMiddleware(rawName);
            break;
        case "make:controller":
            await handleMakeController(rawName, isModuleFlag);
            break;
        case "make:service":
            await handleMakeService(rawName, isModuleFlag);
            break;
        case "make:routes":
            await handleMakeRoutes(rawName, isModuleFlag);
            break;
        default:
            console.error(`[ERROR] Comando no reconocido: ${command}`);
            process.exit(1);
    }
}

main();