import { Component, OnInit } from '@angular/core';
import { DonutSegment } from '../../../shared/components/charts/chart.model';
import { PeriodeStat, ProvinsiStat, SibarduktransService, SibUnit, SIB_TAHUN, UmurStat } from '../../services/sibarduktrans.service';
import { ColSeries } from './sib-column-chart.component';

/**
 * "Data Transmigran" — the four statistics of the Sibarduktrans "Data Transmigran" page
 * (https://sibarduktrans.transmigrasi.go.id/dataTransmigran) as charts inside DGT: jumlah
 * transmigran per periode, per provinsi asal, per provinsi tujuan, and per kelompok umur. Like the
 * source, each chart has a KK / Jiwa switch and (except Per Periode) a year selector.
 *
 * There is no API yet: all data comes from `SibarduktransService`, which returns illustrative
 * sample data through Observables so the real endpoints can replace it without touching this
 * component. The page says so ("Data contoh") until then.
 */
@Component({
  selector: 'dgt-sibarduktrans',
  templateUrl: './sibarduktrans.component.html',
  styleUrls: ['./sibarduktrans.component.scss']
})
export class SibarduktransComponent implements OnInit {
  readonly tahunOptions = SIB_TAHUN;
  readonly units: SibUnit[] = ['KK', 'Jiwa'];

  // Jumlah animo
  animoUnit: SibUnit = 'KK';
  animoTotal = 0;

  // Per periode
  periodeUnit: SibUnit = 'KK';
  periodeCats: string[] = [];
  periodeSeries: ColSeries[] = [];

  // Per provinsi asal
  asalTahun = SIB_TAHUN[0];
  asalUnit: SibUnit = 'KK';
  asalCats: string[] = [];
  asalSeries: ColSeries[] = [];
  asalPct: string[] = [];

  // Per provinsi tujuan
  tujuanTahun = SIB_TAHUN[0];
  tujuanUnit: SibUnit = 'KK';
  tujuanCats: string[] = [];
  tujuanSeries: ColSeries[] = [];
  tujuanPct: string[] = [];

  // Per kelompok umur
  umurTahun = SIB_TAHUN[0];
  umurUnit: SibUnit = 'KK';
  umurRows: UmurStat[] = [];
  umurSegments: DonutSegment[] = [];
  umurTotal = 0;

  constructor(private readonly sib: SibarduktransService) {}

  ngOnInit(): void {
    this.loadAnimo();
    this.loadPeriode();
    this.loadAsal();
    this.loadTujuan();
    this.loadUmur();
  }

  loadAnimo(): void {
    this.sib.getJumlahAnimo(this.animoUnit).subscribe((n: number) => (this.animoTotal = n));
  }

  setAnimoUnit(u: SibUnit): void {
    this.animoUnit = u;
    this.loadAnimo();
  }

  loadPeriode(): void {
    this.sib.getPeriode(this.periodeUnit).subscribe((rows: PeriodeStat[]) => {
      this.periodeCats = rows.map(r => String(r.tahun));
      this.periodeSeries = [
        { name: 'TPS dan TPA', color: '#d81b7a', values: rows.map(r => r.tpsTpa) },
        { name: 'TPS', color: '#1e88d6', values: rows.map(r => r.tps) },
        { name: 'TPA', color: '#fbb83a', values: rows.map(r => r.tpa) }
      ];
    });
  }

  loadAsal(): void {
    this.sib.getPerProvinsiAsal(this.asalTahun, this.asalUnit).subscribe((rows: ProvinsiStat[]) => {
      this.asalCats = rows.map(r => r.nama);
      this.asalSeries = [{ name: this.asalUnit, color: '#1e88d6', values: rows.map(r => r.nilai) }];
      this.asalPct = rows.map(r => r.pct.toFixed(1) + '%');
    });
  }

  loadTujuan(): void {
    this.sib.getPerProvinsiTujuan(this.tujuanTahun, this.tujuanUnit).subscribe((rows: ProvinsiStat[]) => {
      this.tujuanCats = rows.map(r => r.nama);
      this.tujuanSeries = [{ name: this.tujuanUnit, color: '#1f8a4c', values: rows.map(r => r.nilai) }];
      this.tujuanPct = rows.map(r => r.pct.toFixed(1) + '%');
    });
  }

  loadUmur(): void {
    this.sib.getPerKelompokUmur(this.umurTahun, this.umurUnit).subscribe((rows: UmurStat[]) => {
      this.umurRows = rows;
      this.umurSegments = rows.map(r => ({ label: r.label, value: r.nilai, color: r.color }));
      this.umurTotal = rows.reduce((s, r) => s + r.nilai, 0);
    });
  }

  setPeriodeUnit(u: SibUnit): void {
    this.periodeUnit = u;
    this.loadPeriode();
  }

  setAsalUnit(u: SibUnit): void {
    this.asalUnit = u;
    this.loadAsal();
  }

  setTujuanUnit(u: SibUnit): void {
    this.tujuanUnit = u;
    this.loadTujuan();
  }

  setUmurUnit(u: SibUnit): void {
    this.umurUnit = u;
    this.loadUmur();
  }

  fmt(n: number): string {
    return n.toLocaleString('id-ID');
  }
}
