-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "vendedor" TEXT,
ALTER COLUMN "numero_parcelas" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProdutoPreco" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "sub_categoria" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "ProdutoPreco_pkey" PRIMARY KEY ("id")
);
