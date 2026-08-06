// cli/vane.ts
import pkg from "@prisma/internals";
const { getDMMF } = pkg;

import { readFileSync } from "fs";
import { join } from "path";

async function main() {
    const modelName = process.argv[2];

    if (!modelName) {
        console.error(
            "❌ Debes indicar el nombre del modelo. Ejemplo: pnpm vane User",
        );
        process.exit(1);
    }

    const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
    const schema = readFileSync(schemaPath, "utf-8");

    const dmmf = await getDMMF({ datamodel: schema });

    const model = dmmf.datamodel.models.find(
        (m) => m.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!model) {
        console.error(
            `❌ No encontré el modelo "${modelName}" en tu schema.prisma`,
        );
        process.exit(1);
    }

    console.log(JSON.stringify(model, null, 2));
}

main();
