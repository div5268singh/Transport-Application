import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ConsignmentStatus = 'Created' | 'PickedUp' | 'InTransit' | 'Delivered';

export interface PartyDto {
  companyName: string;
  contactPerson1Name: string;
  contactPerson1Phone: string;
  contactPerson2Name: string;
  contactPerson2Phone: string;
  email: string;
  address: string;
}

export interface BillingDto {
  orderPrice: number;
  receivedAmount: number;
  balancePaymentMode: string;
  balancePaymentNotes: string;
}

export interface DriverDetailsDto {
  vehicleNumber: string;
  driverName: string;
  driverContactNo: string;
  secondContactNo: string;
  ownerContactNo: string;
}

export interface CreateConsignmentRequest {
  sender: PartyDto;
  receiver: PartyDto;
  billing: BillingDto;
  driver: DriverDetailsDto;
}

export interface CreateConsignmentResponse {
  id: number;
  consignmentNumber: string;
  trackingLink: string;
  driverUsername: string;
  driverPasswordPlaintext: string;
}

export interface ConsignmentSummary {
  id: number;
  consignmentNumber: string;
  status: ConsignmentStatus;
  senderCompanyName: string;
  receiverCompanyName: string;
  createdAt: string;
}

export interface TrackingUpdateDto {
  cityName: string;
  areaName: string;
  updatedAt: string;
}

export interface ConsignmentDetail {
  id: number;
  consignmentNumber: string;
  status: ConsignmentStatus;
  createdAt: string;
  deliveredAt: string | null;
  sender: PartyDto;
  receiver: PartyDto;
  billing: BillingDto;
  driver: DriverDetailsDto;
  trackingUpdates: TrackingUpdateDto[];
}

export interface PublicTracking {
  consignmentNumber: string;
  status: ConsignmentStatus;
  senderCompanyName: string;
  receiverCompanyName: string;
  vehicleNumber: string;
  driverName: string;
  history: TrackingUpdateDto[];
}

@Injectable({ providedIn: 'root' })
export class ConsignmentService {
  private readonly base = '/api/consignments';

  constructor(private readonly http: HttpClient) {}

  create(request: CreateConsignmentRequest): Observable<CreateConsignmentResponse> {
    return this.http.post<CreateConsignmentResponse>(this.base, request);
  }

  list(status?: ConsignmentStatus): Observable<ConsignmentSummary[]> {
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ConsignmentSummary[]>(this.base, { params });
  }

  detail(id: number): Observable<ConsignmentDetail> {
    return this.http.get<ConsignmentDetail>(`${this.base}/${id}`);
  }

  update(id: number, request: CreateConsignmentRequest): Observable<ConsignmentDetail> {
    return this.http.put<ConsignmentDetail>(`${this.base}/${id}`, request);
  }

  updateStatus(id: number, status: ConsignmentStatus): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}/status`, { status });
  }

  track(consignmentNumber: string): Observable<PublicTracking> {
    return this.http.get<PublicTracking>(`/api/tracking/${consignmentNumber}`);
  }
}
