import { printBanner, printHelp, logger } from "./utils/logger.util.js";
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

    // Si no se pasan argumentos o piden ayuda
    if (!firstArg || firstArg === "--help" || firstArg === "-h") {
        printHelp();
        process.exit(0);
    }

    const isSubcommand = firstArg.startsWith("make:");
    const command = isSubcommand ? firstArg : "make:all";
    const rawName = isSubcommand ? secondArg : firstArg;

    if (!rawName) {
        printBanner();
        logger.error(`Debes indicar el nombre objetivo para el comando "${command}".`);
        console.log(`   Ejemplo: pnpm vane ${command} MiModelo\n`);
        process.exit(1);
    }

    // Mostrar presentación antes de iniciar cualquier operación
    printBanner();

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
            logger.error(`Comando no reconocido: "${command}"`);
            process.exit(1);
    }
}

main();