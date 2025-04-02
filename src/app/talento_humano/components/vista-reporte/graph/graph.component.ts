import { style } from '@angular/animations';
import { Component, HostBinding, Input } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { bind } from 'lodash';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  host: {
    style: 'display: block; width:300px; height: 300px;',
  },
})
export class GraphComponent {
  //input , output
  @Input() public data: any;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: any[] = ['Red', 'Blue'];
  public barChartType: ChartType = 'doughnut'; // Tipo de gráfico
  public barChartLegend = true;
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [65, 59, 80],
        label: 'Series A',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
}
