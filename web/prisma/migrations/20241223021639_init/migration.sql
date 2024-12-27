/*
  Warnings:

  - A unique constraint covering the columns `[marca_timestamp,email,telefono]` on the table `Practica` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Practica" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Practica_marca_timestamp_email_telefono_key" ON "Practica"("marca_timestamp", "email", "telefono");
