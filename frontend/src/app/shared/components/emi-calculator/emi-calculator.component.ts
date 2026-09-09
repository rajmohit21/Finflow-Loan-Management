import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  template: `
    <div class="ff-card p-4">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h5 class="mb-0 fw-bold d-flex align-items-center gap-2">
          <i class="bi bi-calculator-fill text-primary"></i>
          Loan EMI & Interest Calculator
        </h5>
        <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">Real-time Estimate</span>
      </div>

      <div class="row g-4">
        <div class="col-lg-7">
          <!-- Loan Amount Slider -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label text-muted mb-0 fw-semibold">Loan Amount (₹)</label>
              <div class="input-group input-group-sm style-input-w">
                <span class="input-group-text">₹</span>
                <input 
                  type="number" 
                  class="form-control text-end fw-bold text-primary" 
                  [(ngModel)]="amount" 
                  (ngModelChange)="calculate()"
                  step="10000"
                  min="25000"
                  max="10000000"
                />
              </div>
            </div>
            <input 
              type="range" 
              class="form-range" 
              min="25000" 
              max="10000000" 
              step="25000" 
              [(ngModel)]="amount" 
              (ngModelChange)="calculate()"
            />
            <div class="d-flex justify-content-between text-muted fs-8">
              <span>₹25,000</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          <!-- Interest Rate Slider -->
          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label text-muted mb-0 fw-semibold">Annual Interest Rate (%)</label>
              <div class="input-group input-group-sm style-input-w">
                <input 
                  type="number" 
                  class="form-control text-end fw-bold text-primary" 
                  [(ngModel)]="interestRate" 
                  (ngModelChange)="calculate()"
                  step="0.25"
                  min="5"
                  max="24"
                />
                <span class="input-group-text">%</span>
              </div>
            </div>
            <input 
              type="range" 
              class="form-range" 
              min="5" 
              max="24" 
              step="0.25" 
              [(ngModel)]="interestRate" 
              (ngModelChange)="calculate()"
            />
            <div class="d-flex justify-content-between text-muted fs-8">
              <span>5%</span>
              <span>24%</span>
            </div>
          </div>

          <!-- Tenure Slider -->
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label text-muted mb-0 fw-semibold">Tenure (Months)</label>
              <div class="input-group input-group-sm style-input-w">
                <input 
                  type="number" 
                  class="form-control text-end fw-bold text-primary" 
                  [(ngModel)]="tenureMonths" 
                  (ngModelChange)="calculate()"
                  step="6"
                  min="6"
                  max="360"
                />
                <span class="input-group-text">Mo</span>
              </div>
            </div>
            <input 
              type="range" 
              class="form-range" 
              min="6" 
              max="360" 
              step="6" 
              [(ngModel)]="tenureMonths" 
              (ngModelChange)="calculate()"
            />
            <div class="d-flex justify-content-between text-muted fs-8">
              <span>6 Months (0.5 Yr)</span>
              <span>360 Months (30 Yrs)</span>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <!-- Calculation Summary Box -->
          <div class="p-4 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 h-100 d-flex flex-column justify-content-between">
            <div>
              <div class="text-uppercase text-muted fw-bold fs-8 mb-1">Estimated Monthly EMI</div>
              <div class="display-6 fw-extrabold text-primary mb-3">{{ monthlyEmi | currencyFormat }}</div>
              
              <hr class="border-primary border-opacity-25 my-3" />

              <div class="d-flex justify-content-between mb-2 fs-7">
                <span class="text-muted">Principal Amount:</span>
                <span class="fw-semibold">{{ amount | currencyFormat }}</span>
              </div>

              <div class="d-flex justify-content-between mb-2 fs-7">
                <span class="text-muted">Total Interest Payable:</span>
                <span class="fw-semibold text-warning">{{ totalInterest | currencyFormat }}</span>
              </div>

              <div class="d-flex justify-content-between fs-7">
                <span class="text-muted">Total Payable (P + I):</span>
                <span class="fw-bold text-success">{{ totalPayable | currencyFormat }}</span>
              </div>
            </div>

            <!-- Visual proportion bar -->
            <div class="mt-4">
              <div class="progress" style="height: 10px;">
                <div class="progress-bar bg-primary" [style.width.%]="principalPercentage" title="Principal"></div>
                <div class="progress-bar bg-warning" [style.width.%]="interestPercentage" title="Interest"></div>
              </div>
              <div class="d-flex justify-content-between text-muted fs-8 mt-1">
                <span><i class="bi bi-circle-fill text-primary me-1"></i> Principal ({{ principalPercentage | number:'1.0-0' }}%)</span>
                <span><i class="bi bi-circle-fill text-warning me-1"></i> Interest ({{ interestPercentage | number:'1.0-0' }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fs-7 { font-size: 0.875rem; }
    .fs-8 { font-size: 0.75rem; }
    .fw-extrabold { font-weight: 800; }
    .style-input-w { max-width: 140px; }
  `]
})
export class EmiCalculatorComponent implements OnInit {
  @Input() amount: number = 500000;
  @Input() interestRate: number = 10.5;
  @Input() tenureMonths: number = 36;
  @Output() calculationChanged = new EventEmitter<{ emi: number; totalInterest: number; totalPayable: number }>();

  monthlyEmi: number = 0;
  totalInterest: number = 0;
  totalPayable: number = 0;
  principalPercentage: number = 70;
  interestPercentage: number = 30;

  ngOnInit(): void {
    this.calculate();
  }

  calculate(): void {
    if (!this.amount || !this.interestRate || !this.tenureMonths) return;

    const r = this.interestRate / 12 / 100;
    const n = this.tenureMonths;

    if (r === 0) {
      this.monthlyEmi = this.amount / n;
    } else {
      this.monthlyEmi = (this.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    this.totalPayable = this.monthlyEmi * n;
    this.totalInterest = this.totalPayable - this.amount;

    if (this.totalPayable > 0) {
      this.principalPercentage = (this.amount / this.totalPayable) * 100;
      this.interestPercentage = (this.totalInterest / this.totalPayable) * 100;
    }

    this.calculationChanged.emit({
      emi: Math.round(this.monthlyEmi),
      totalInterest: Math.round(this.totalInterest),
      totalPayable: Math.round(this.totalPayable)
    });
  }
}
