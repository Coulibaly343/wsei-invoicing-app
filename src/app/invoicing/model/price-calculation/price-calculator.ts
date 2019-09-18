import { Tax } from '../item';

export interface ItemPrice {
    net: number;
    tax: Tax;
    gross: number;
    taxValue: number;
}

export interface CalcRequest {
    netto?: number;
    gross?: number;
    tax: Tax;
}

export class NotEnoughParamsError extends TypeError {
}

export class PriceCalculator {
  calculate(calculationRequest: CalcRequest): ItemPrice {
      if (calculationRequest.netto != null) {
        const gross = this.calculateGross(calculationRequest);
        const taxValue = gross - calculationRequest.netto;
        return {
            net: calculationRequest.netto,
            gross: gross,
            tax: calculationRequest.tax,
            taxValue: taxValue
        };
      }

      if (calculationRequest.gross != null) {
        const netto = this.calculateNetto(calculationRequest);
        const taxValue = this.getTaxValue(calculationRequest.gross, netto);
        return {
            net: netto,
            gross: calculationRequest.gross,
            tax: calculationRequest.tax,
            taxValue: taxValue
        };
      }

      throw  new NotEnoughParamsError('not enough parameters');
  }

    private getTaxValue(gross: number, netto: number): number {
        return this.round((gross - netto), 2);
    }

    private calculateGross(calculationRequest: CalcRequest): number {
        return this.round(calculationRequest.netto + (calculationRequest.netto * calculationRequest.tax), 2);
    }

    private calculateNetto(calculationRequest: CalcRequest): number {
        return this.round(calculationRequest.gross /  (1 + calculationRequest.tax), 2);
    }

    private round(price: number, digits: number): number {
        const rounded = Number((Math.round(price * 100) / 100).toFixed(digits));
        return rounded;
    }
}
