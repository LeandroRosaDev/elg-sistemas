-- CreateTable
CREATE TABLE "OperacaoFinanceira" (
    "id" SERIAL NOT NULL,
    "tipoOperacao" TEXT NOT NULL,
    "nomeOperacao" TEXT NOT NULL,
    "observacao" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "mes" TEXT NOT NULL,

    CONSTRAINT "OperacaoFinanceira_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_mes" ON "OperacaoFinanceira"("mes");

-- CreateIndex
CREATE INDEX "idx_data" ON "OperacaoFinanceira"("data");
