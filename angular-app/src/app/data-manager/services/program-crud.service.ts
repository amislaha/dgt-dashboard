import { Injectable } from '@angular/core';
import { PROGRAM_SEED } from '../data/seed-data';
import { Program } from '../models/program.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class ProgramCrudService extends EntityCrudService<Program> {
  constructor() {
    super('program', PROGRAM_SEED, 'prog');
  }
}
