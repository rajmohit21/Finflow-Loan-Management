import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, compact: boolean = false): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '₹0';
    }

    if (compact && value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (compact && value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakh`;
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }
}
