import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Calculadora() {
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState<number[]>([]);

  const calcularParcelas = () => {
    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) return;

    // Aplica as taxas de 2,69% e 5% sobre o valor
    const valorComTaxas = valorNum + valorNum * 0.0269 + valorNum * 0.05;

    // Calcula as parcelas de 1x a 12x
    const novoParcelas = Array.from({ length: 12 }, (_, i) =>
      parseFloat((valorComTaxas / (i + 1)).toFixed(2))
    );

    setParcelas(novoParcelas);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span>Calculadora de Preço</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Calculadora de Preço</SheetTitle>
          <SheetDescription>
            Insira o valor para calcular o preço com taxas e o valor das
            parcelas.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valor" className="text-right">
              Valor
            </Label>
            <Input
              id="valor"
              placeholder="Digite o valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button onClick={calcularParcelas} className="col-span-4">
            Calcular
          </Button>

          {parcelas.length > 0 && (
            <div className="pt-4">
              <h3 className="text-lg font-semibold">Resultados:</h3>
              <ul className="mt-2 space-y-2">
                {parcelas.map((parcela, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{index + 1}x:</span>
                    <span>R$ {parcela.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
