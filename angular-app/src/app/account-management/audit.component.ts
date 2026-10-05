import { Component } from '@angular/core';
import { AuditEntry, AuditService } from './audit.service';

@Component({
  selector: 'dgt-am-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AuditComponent {
  entries: AuditEntry[] = [];

  constructor(private readonly audit: AuditService) {
    this.entries = this.audit.list();
  }

  clear(): void {
    this.audit.clear();
    this.entries = [];
  }
}
