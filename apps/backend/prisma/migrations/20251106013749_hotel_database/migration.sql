-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "rol" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "clienteId" TEXT,
    "telefono" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "ultimoAcceso" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_habitacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "amenidades" JSONB NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_habitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitaciones" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,
    "precioBase" DOUBLE PRECISION NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "piso" INTEGER NOT NULL,
    "vista" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habitaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "habitacionId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "precioTotal" DOUBLE PRECISION NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "numeroHuespedes" INTEGER NOT NULL,
    "observaciones" TEXT,
    "motivoCancelacion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "usuarios_activo_idx" ON "usuarios"("activo");

-- CreateIndex
CREATE INDEX "usuarios_clienteId_idx" ON "usuarios"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_habitacion_nombre_key" ON "tipos_habitacion"("nombre");

-- CreateIndex
CREATE INDEX "tipos_habitacion_nombre_idx" ON "tipos_habitacion"("nombre");

-- CreateIndex
CREATE INDEX "tipos_habitacion_capacidad_idx" ON "tipos_habitacion"("capacidad");

-- CreateIndex
CREATE UNIQUE INDEX "habitaciones_numero_key" ON "habitaciones"("numero");

-- CreateIndex
CREATE INDEX "habitaciones_numero_idx" ON "habitaciones"("numero");

-- CreateIndex
CREATE INDEX "habitaciones_tipoId_idx" ON "habitaciones"("tipoId");

-- CreateIndex
CREATE INDEX "habitaciones_activa_idx" ON "habitaciones"("activa");

-- CreateIndex
CREATE INDEX "habitaciones_piso_idx" ON "habitaciones"("piso");

-- CreateIndex
CREATE INDEX "habitaciones_activa_tipoId_idx" ON "habitaciones"("activa", "tipoId");

-- CreateIndex
CREATE INDEX "reservas_habitacionId_idx" ON "reservas"("habitacionId");

-- CreateIndex
CREATE INDEX "reservas_clienteId_idx" ON "reservas"("clienteId");

-- CreateIndex
CREATE INDEX "reservas_estado_idx" ON "reservas"("estado");

-- CreateIndex
CREATE INDEX "reservas_checkIn_idx" ON "reservas"("checkIn");

-- CreateIndex
CREATE INDEX "reservas_checkOut_idx" ON "reservas"("checkOut");

-- CreateIndex
CREATE INDEX "reservas_habitacionId_checkIn_checkOut_idx" ON "reservas"("habitacionId", "checkIn", "checkOut");

-- CreateIndex
CREATE INDEX "reservas_estado_checkIn_idx" ON "reservas"("estado", "checkIn");

-- CreateIndex
CREATE INDEX "reservas_clienteId_estado_idx" ON "reservas"("clienteId", "estado");

-- AddForeignKey
ALTER TABLE "habitaciones" ADD CONSTRAINT "habitaciones_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipos_habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
