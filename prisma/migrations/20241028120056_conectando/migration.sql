-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome_cliente" TEXT NOT NULL,
    "nome_entrega" TEXT NOT NULL,
    "data_entrega" TIMESTAMP(3) NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "ponto_referencia" TEXT,
    "obs" TEXT,
    "email" TEXT NOT NULL,
    "telefone_1" TEXT NOT NULL,
    "telefone_2" TEXT,
    "nome_produto_1" TEXT NOT NULL,
    "nome_produto_2" TEXT,
    "nome_produto_3" TEXT,
    "nome_produto_4" TEXT,
    "nome_produto_5" TEXT,
    "desc_produto_1" TEXT NOT NULL,
    "desc_produto_2" TEXT,
    "desc_produto_3" TEXT,
    "desc_produto_4" TEXT,
    "desc_produto_5" TEXT,
    "qtd_1" TEXT NOT NULL,
    "qtd_2" TEXT,
    "qtd_3" TEXT,
    "qtd_4" TEXT,
    "qtd_5" TEXT,
    "forma_pagamento" TEXT NOT NULL,
    "numero_parcelas" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
