/**
 * Seed script para poblar la base de datos con datos iniciales
 * Ejecutar con: npm run prisma:seed o yarn prisma:seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes (opcional - solo en desarrollo)
  // if (process.env.NODE_ENV === "development") {
  //   console.log("🧹 Limpiando datos existentes...");
  //   await prisma.reserva.deleteMany();
  //   await prisma.habitacion.deleteMany();
  //   await prisma.tipoHabitacion.deleteMany();
  //   await prisma.usuario.deleteMany();
  // }

  // 1. Crear tipos de habitación
  console.log("📦 Creando tipos de habitación...");
  
  const tipoIndividual = await prisma.tipoHabitacion.upsert({
    where: { id: "tipo-individual" },
    update: {},
    create: {
      id: "tipo-individual",
      nombre: "individual",
      descripcion: "Habitación individual para una persona",
      capacidad: 1,
      amenidades: ["WiFi", "TV"],
    },
  });

  const tipoDoble = await prisma.tipoHabitacion.upsert({
    where: { id: "tipo-doble" },
    update: {},
    create: {
      id: "tipo-doble",
      nombre: "doble",
      descripcion: "Habitación doble para dos personas",
      capacidad: 2,
      amenidades: ["WiFi", "TV", "Minibar"],
    },
  });

  const tipoSuite = await prisma.tipoHabitacion.upsert({
    where: { id: "tipo-suite" },
    update: {},
    create: {
      id: "tipo-suite",
      nombre: "suite",
      descripcion: "Suite de lujo para hasta 4 personas",
      capacidad: 4,
      amenidades: ["WiFi", "TV", "Minibar", "Jacuzzi", "Vista al mar"],
    },
  });

  console.log(`✅ Tipos de habitación creados: ${tipoIndividual.nombre}, ${tipoDoble.nombre}, ${tipoSuite.nombre}`);

  // 2. Crear habitaciones
  console.log("🛏️  Creando habitaciones...");

  const habitaciones = [
    {
      id: "habitacion-101",
      numero: "101",
      tipoId: tipoIndividual.id,
      precioBase: 100.0,
      moneda: "USD",
      activa: true,
      piso: 1,
      vista: "vista al jardín",
    },
    {
      id: "habitacion-102",
      numero: "102",
      tipoId: tipoIndividual.id,
      precioBase: 100.0,
      moneda: "USD",
      activa: true,
      piso: 1,
      vista: "vista al jardín",
    },
    {
      id: "habitacion-201",
      numero: "201",
      tipoId: tipoDoble.id,
      precioBase: 150.0,
      moneda: "USD",
      activa: true,
      piso: 2,
      vista: "vista al mar",
    },
    {
      id: "habitacion-202",
      numero: "202",
      tipoId: tipoDoble.id,
      precioBase: 150.0,
      moneda: "USD",
      activa: true,
      piso: 2,
      vista: "vista al mar",
    },
    {
      id: "habitacion-301",
      numero: "301",
      tipoId: tipoSuite.id,
      precioBase: 300.0,
      moneda: "USD",
      activa: true,
      piso: 3,
      vista: "vista panorámica",
    },
  ];

  for (const habitacion of habitaciones) {
    await prisma.habitacion.upsert({
      where: { id: habitacion.id },
      update: {},
      create: habitacion,
    });
  }

  console.log(`✅ ${habitaciones.length} habitaciones creadas`);

  // 3. Crear usuarios
  console.log("👤 Creando usuarios...");

  const passwordHash = await bcrypt.hash("password123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const recepPasswordHash = await bcrypt.hash("recep123", 10);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      id: "user-admin-1",
      nombre: "Administrador",
      email: "admin@hotel.com",
      passwordHash: adminPasswordHash,
      rol: "admin",
      activo: true,
    },
  });

  const recepcionista = await prisma.usuario.upsert({
    where: { email: "recep@hotel.com" },
    update: {},
    create: {
      id: "user-recep-1",
      nombre: "Recepcionista",
      email: "recep@hotel.com",
      passwordHash: recepPasswordHash,
      rol: "recepcionista",
      activo: true,
    },
  });

  const huesped = await prisma.usuario.upsert({
    where: { email: "juan@example.com" },
    update: {},
    create: {
      id: "user-huesped-1",
      nombre: "Juan Pérez",
      email: "juan@example.com",
      passwordHash: passwordHash,
      rol: "huesped",
      activo: true,
      telefono: "+1234567890",
    },
  });

  console.log(`✅ Usuarios creados: ${admin.nombre}, ${recepcionista.nombre}, ${huesped.nombre}`);
  console.log("🔑 Credenciales de prueba:");
  console.log("   Admin: admin@hotel.com / admin123");
  console.log("   Recepcionista: recep@hotel.com / recep123");
  console.log("   Huésped: juan@example.com / password123");

  console.log("✅ Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

