import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestServicesService } from 'src/app/services/rest-services.service';
import { Color } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, OnDestroy {

  /**
   * Stores the Value of Symbols to be Shown
   */
  symbols = [];
  /**
   * Stores Historical Data
   */
  historicalData: any;
  /**
   * Stores Error Message
   */
  ErrorMessage: string;
  /**
   * CheckBox FormGroup
   */
  checkboxGroup: FormGroup;
  /**
   * Time Interval for Api Calls
   */
  dataInterval: any;
  /**
   * Active Symbols to store Data
   */
  activeSymbols: any;
  /**
   * Chart Options
   */
  options: (ChartOptions);
  /**
   * Chart Colors
   */
  lineChartColors: Color[];
  /**
   * Chart Legend Option
   */
  lineChartLegend: boolean;
  /**
   * Chart Type
   */
  lineChartType: string;

  /**
   * Loading Variable
   */
  isLoading: boolean;


  /**
   * Constructor
   * @param restService Rest Service Initialization
   * @param formBuilder Form Builder Initialization
   */
  constructor(private restService: RestServicesService, private formBuilder: FormBuilder) {
    this.isLoading = true;
    this.symbols = ['BRK-A', 'NVR', 'AMZN', 'SHOP'];
    this.historicalData = [];
    this.activeSymbols = [];
    this.options = {
      responsive: true,
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            maxTicksLimit: 5
          }
        }]
      }
    };
    this.lineChartColors = [
      {
        borderColor: 'black',
        backgroundColor: 'transparent',
      },
    ];
    this.lineChartLegend = false;
    this.lineChartType = 'line';

  }

  /**
   * NgOn Init
   */
  ngOnInit(): void {

    this.fetchData();


  }

  /**
   * SetInterval call for Tracking the Data
   */
  trackData(): void {
    this.dataInterval = setInterval(() => {
      this.fetchData();
    }, 15000);
  }

  /**
   * NgOn Destroy
   */
  ngOnDestroy(): void {
    clearInterval(this.dataInterval);
  }

  /**
   * Fetchs the data from the Api
   */
  fetchData(): void {
    let symbolString = this.activeSymbols.length > 0 ? this.activeSymbols.toString() : this.symbols.toString();
    this.restService.getStockListing(symbolString).subscribe((res: any) => {
      if (!res['Error Message']) {
        let currentDate = new Date();
        var containsData = [];
        let data = res;
        data.map((x: any) => {
          let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
          let currentPrice = {
            "Time": currentTime,
            "Price": x.price
          }
          let trial = {
            ...x,
            historyData: [currentPrice],
            prices: [x.price],
            time: [currentTime],
            startTime: '',
            endTime: ''
          }
          if (this.historicalData.length > 0) {
            containsData = this.historicalData.filter((value: any, index: number) => {
              let currentData = '';
              if (value.symbol == x.symbol) {
                this.historicalData[index].historyData.push(currentPrice);
                this.historicalData[index].prices.push(x.price);
                this.historicalData[index].time.push(currentTime);
                currentData = this.historicalData[index];
                return currentData;
              }
            })
          }
          if (containsData.length == 0) {
            this.historicalData.push(trial);
            this.checkboxGroup = this.formBuilder.group({
              myCategory: this.formBuilder.array(this.historicalData)
            });
          }
        })
      }
      else {
        this.ErrorMessage = res['Error Message'];
      }
    }, (err) => {
      this.ErrorMessage = "Something Went Wrong";
    });
    this.isLoading = false;
  }


  /**
   * On checkbox check Function
   * @param e EventParams
   */
  onCheckChange(e: any): void {
    let currentDate = new Date();
    let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    if (e.target.checked) {
      this.activeSymbols.push(e.target.value);
      this.historicalData.map((x: any) => {
        if (x.symbol == e.target.value) {
          x.startTime = currentTime;
          x.endTime = 'Running';
        }
      })
    } else {
      this.historicalData.map((x: any) => {
        if (x.symbol == e.target.value) {
          x.historyData = [];
          x.prices = [];
          x.time = [];
          x.endTime = currentTime;
        }
      })
      this.activeSymbols = this.activeSymbols.filter(function (item: any) {
        return item !== e.target.value
      })
    }
    clearInterval(this.dataInterval);
    this.activeSymbols.length > 0 ? this.trackData() : '';
  }
}
