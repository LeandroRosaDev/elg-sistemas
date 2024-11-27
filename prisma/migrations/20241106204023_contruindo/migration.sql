/*
  Warnings:

  - Added the required column `valor_parcelado` to the `ProdutoPreco` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProdutoPreco" ADD COLUMN     "valor_parcelado" TEXT NOT NULL;
