import { Component, OnInit } from '@angular/core';
import { ConsignmentService, ConsignmentStatus, ConsignmentSummary } from '../../../core/services/consignment';

@Component({
  selector: 'app-consignment-list',
  standalone: false,
  templateUrl: './consignment-list.html',
})
export class ConsignmentList implements OnInit {
  consignments: ConsignmentSummary[] = [];
  loading = true;
  errorMessage = '';
  statusFilter: ConsignmentStatus | 'All' = 'All';

  readonly statusOptions: Array<ConsignmentStatus | 'All'> = ['All', 'Created', 'PickedUp', 'InTransit', 'Delivered'];

  constructor(private readonly consignmentService: ConsignmentService) {}

  ngOnInit(): void {
    this.load();
  }

  onStatusFilterChange(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';

    const status = this.statusFilter === 'All' ? undefined : this.statusFilter;

    this.consignmentService.list(status).subscribe({
      next: (data) => {
        this.consignments = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load consignments. Check that the API is running and you are logged in.';
        this.loading = false;
      },
    });
  }
}
