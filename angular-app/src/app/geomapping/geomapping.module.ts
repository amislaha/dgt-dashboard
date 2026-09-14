import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GeomappingRoutingModule } from './geomapping-routing.module';
import { GeomappingShellComponent } from './geomapping-shell.component';
import { GeomappingMapComponent } from './components/geomapping-map/geomapping-map.component';
import { PublicMappingComponent } from './components/public-mapping/public-mapping.component';
import { MyLayersComponent } from './components/my-layers/my-layers.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';

@NgModule({
  declarations: [GeomappingShellComponent, GeomappingMapComponent, PublicMappingComponent, MyLayersComponent, ComingSoonComponent],
  imports: [SharedModule, GeomappingRoutingModule]
})
export class GeomappingModule {}
