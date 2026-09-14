import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GeomappingRoutingModule } from './geomapping-routing.module';
import { GeomappingShellComponent } from './geomapping-shell.component';
import { GeomappingMapComponent } from './components/geomapping-map/geomapping-map.component';
import { PublicMappingComponent } from './components/public-mapping/public-mapping.component';
import { MyLayersComponent } from './components/my-layers/my-layers.component';
import { ApprovalComponent } from './components/approval/approval.component';
import { TaskComponent } from './components/task/task.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';

@NgModule({
  declarations: [
    GeomappingShellComponent,
    GeomappingMapComponent,
    PublicMappingComponent,
    MyLayersComponent,
    ApprovalComponent,
    TaskComponent,
    ActivityComponent,
    ComingSoonComponent
  ],
  imports: [SharedModule, GeomappingRoutingModule]
})
export class GeomappingModule {}
