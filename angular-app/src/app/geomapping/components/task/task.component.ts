import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeomappingTask } from '../../models/geomapping.model';
import { GeomappingDataService } from '../../services/geomapping-data.service';
import { GeomappingToastService } from '../../services/geomapping-toast.service';

/** Ports `renderTaskPanel()` (geomapping/index.html:3173) — "Edit Mode → Task", PRD F-5.13/F-5.14. */
@Component({
  selector: 'dgt-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {
  tasks: GeomappingTask[] = [];
  newTitle = '';

  private readonly subs: Subscription[] = [];

  constructor(readonly data: GeomappingDataService, private readonly toast: GeomappingToastService) {}

  ngOnInit(): void {
    this.subs.push(this.data.tasks$.subscribe(t => (this.tasks = t)));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  get openCount(): number {
    return this.tasks.filter(t => !t.done).length;
  }

  toggleDone(id: string, done: boolean): void {
    this.data.toggleTaskDone(id, done);
  }

  deleteTask(id: string): void {
    this.data.deleteTask(id);
  }

  addTask(): void {
    const title = (this.newTitle || '').trim();
    if (!title) {
      this.toast.show('Judul tugas wajib diisi', 'err');
      return;
    }
    this.data.addTask(title);
    this.newTitle = '';
    this.toast.show('Tugas ditambahkan', 'ok');
  }
}
