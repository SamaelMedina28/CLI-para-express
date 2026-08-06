// cli/vane.ts

const modelName = process.argv[2];

if (!modelName) {
    console.error(
        "❌ Debes indicar el nombre del modelo. Ejemplo: pnpm vane Libro",
    );
    process.exit(1);
}

console.log(`🔨 Generando recursos para el modelo: ${modelName}`);
