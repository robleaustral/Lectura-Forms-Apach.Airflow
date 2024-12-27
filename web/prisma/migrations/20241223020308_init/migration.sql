-- CreateTable
CREATE TABLE "practica" (
    "id" SERIAL NOT NULL,
    "marca_timestamp" TIMESTAMP(6),
    "email" TEXT,
    "empresa" TEXT,
    "telefono" TEXT,
    "detalles_trabajo" TEXT,
    "ubicacion" TEXT,
    "modalidad" TEXT,
    "horas" TEXT,
    "fecha_ini" TIMESTAMP(6),
    "fecha_fin" TIMESTAMP(6),
    "estado" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_practica" ON "practica"("marca_timestamp", "email", "telefono");

