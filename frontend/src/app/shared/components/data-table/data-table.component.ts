import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'currency' | 'status' | 'date' | 'custom';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ff-card p-3">
      <!-- Toolbar Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
        <!-- Search Input -->
        <div class="input-group" style="max-width: 320px;">
          <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
          <input 
            type="text" 
            class="form-control border-start-0 ps-0" 
            placeholder="Search records..." 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onFilterChange()"
          />
        </div>

        <!-- Filters & Page Size -->
        <div class="d-flex align-items-center gap-2">
          <!-- Optional Status Filter Dropdown -->
          <select 
            *ngIf="statusOptions && statusOptions.length > 0" 
            class="form-select form-select-sm" 
            style="width: 170px;"
            [(ngModel)]="selectedStatus" 
            (ngModelChange)="onFilterChange()"
          >
            <option value="">All Statuses</option>
            <option *ngFor="let opt of statusOptions" [value]="opt.value">{{ opt.label }}</option>
          </select>

          <!-- Items per page -->
          <div class="d-flex align-items-center gap-1 text-muted fs-8">
            <span>Show</span>
            <select class="form-select form-select-sm" style="width: 70px;" [(ngModel)]="pageSize" (ngModelChange)="onFilterChange()">
              <option [value]="5">5</option>
              <option [value]="10">10</option>
              <option [value]="25">25</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table Body -->
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th 
                *ngFor="let col of columns" 
                class="fw-bold text-muted fs-8 text-uppercase tracking-wider"
                [class.cursor-pointer]="col.sortable"
                (click)="col.sortable ? sortBy(col.key) : null"
              >
                <div class="d-flex align-items-center gap-1">
                  <span>{{ col.label }}</span>
                  <i *ngIf="col.sortable" class="bi" [ngClass]="getSortIcon(col.key)"></i>
                </div>
              </th>
              <th *ngIf="hasActions" class="text-end fw-bold text-muted fs-8 text-uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State -->
            <tr *ngIf="paginatedData.length === 0">
              <td [attr.colspan]="columns.length + (hasActions ? 1 : 0)" class="text-center py-5">
                <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                <h6 class="fw-bold text-muted mb-1">{{ emptyTitle }}</h6>
                <p class="text-muted fs-8 mb-0">{{ emptySubtitle }}</p>
              </td>
            </tr>

            <!-- Table Rows -->
            <tr *ngFor="let row of paginatedData; let i = index">
              <td *ngFor="let col of columns">
                <ng-container [ngSwitch]="col.type">
                  <!-- Custom slot -->
                  <ng-container *ngSwitchCase="'custom'">
                    <ng-container *ngTemplateOutlet="customCellTemplate; context: { $implicit: row, column: col }"></ng-container>
                  </ng-container>

                  <!-- Default text -->
                  <ng-container *ngSwitchDefault>
                    {{ row[col.key] }}
                  </ng-container>
                </ng-container>
              </td>
              <td *ngIf="hasActions" class="text-end">
                <ng-container *ngTemplateOutlet="actionsTemplate; context: { $implicit: row }"></ng-container>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3 pt-3 border-top fs-8 text-muted">
        <div>
          Showing <strong>{{ getStartIndex() }}</strong> to <strong>{{ getEndIndex() }}</strong> of <strong>{{ filteredData.length }}</strong> entries
        </div>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" [class.disabled]="currentPage === 1">
            <button class="page-link" (click)="goToPage(currentPage - 1)"><i class="bi bi-chevron-left"></i></button>
          </li>
          <li *ngFor="let p of pageNumbers" class="page-item" [class.active]="p === currentPage">
            <button class="page-link" (click)="goToPage(p)">{{ p }}</button>
          </li>
          <li class="page-item" [class.disabled]="currentPage === totalPages || totalPages === 0">
            <button class="page-link" (click)="goToPage(currentPage + 1)"><i class="bi bi-chevron-right"></i></button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .fs-8 { font-size: 0.75rem; }
    .cursor-pointer { cursor: pointer; }
    .tracking-wider { letter-spacing: 0.05em; }
  `]
})
export class DataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() statusOptions: { label: string; value: string }[] = [];
  @Input() hasActions: boolean = false;
  @Input() customCellTemplate: any;
  @Input() actionsTemplate: any;
  @Input() emptyTitle: string = 'No records found';
  @Input() emptySubtitle: string = 'Try adjusting your search query or filter options.';

  searchTerm: string = '';
  selectedStatus: string = '';
  sortKey: string = '';
  sortAsc: boolean = true;

  currentPage: number = 1;
  pageSize: number = 10;
  filteredData: any[] = [];
  paginatedData: any[] = [];
  totalPages: number = 1;
  pageNumbers: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.onFilterChange();
    }
  }

  onFilterChange(): void {
    let result = [...(this.data || [])];

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(val => 
          val !== null && val !== undefined && val.toString().toLowerCase().includes(term)
        )
      );
    }

    // Status filter
    if (this.selectedStatus) {
      result = result.filter(item => 
        item.status && item.status.toString().toUpperCase() === this.selectedStatus.toUpperCase()
      );
    }

    // Sorting
    if (this.sortKey) {
      result.sort((a, b) => {
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        if (valA < valB) return this.sortAsc ? -1 : 1;
        if (valA > valB) return this.sortAsc ? 1 : -1;
        return 0;
      });
    }

    this.filteredData = result;
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;
    this.currentPage = 1;
    this.updatePagination();
  }

  sortBy(key: string): void {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.onFilterChange();
  }

  getSortIcon(key: string): string {
    if (this.sortKey !== key) return 'bi-arrow-down-up opacity-50';
    return this.sortAsc ? 'bi-sort-alpha-down text-primary' : 'bi-sort-alpha-up-alt text-primary';
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.filteredData.slice(start, start + this.pageSize);

    this.pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }

  getStartIndex(): number {
    if (this.filteredData.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.filteredData.length ? this.filteredData.length : end;
  }
}
