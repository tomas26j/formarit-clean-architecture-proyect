// Exportar la nueva estructura de Clean Architecture
export * from "./domain/index.js";
export * from "./application/index.js";
export * from "./infrastructure/index.js";
export * from "./shared/types/index.js";

// Mantener compatibilidad con la estructura anterior (solo tipos compartidos)
export * from "./utils/types/index.js";
export * from "./repositories/index.js";
