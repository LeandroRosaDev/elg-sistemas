/*
  Warnings:

  - Added the required column `fornecedor` to the `ProdutoPreco` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProdutoPreco" ADD COLUMN     "fornecedor" TEXT NOT NULL;
