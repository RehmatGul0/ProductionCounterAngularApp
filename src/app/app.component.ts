import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceInformation, DeviceStatistics } from './interface';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[DatePipe]
})
export class AppComponent implements OnInit, OnDestroy {
  devicesInformation: DeviceInformation [] = [];
  deviceStatistics: DeviceStatistics[] = [];
  deviceStatisticsSubscription: Subscription;

  constructor(private service: ServiceService, private datePipe: DatePipe) {
  }

  async ngOnInit() {
    await this.initializeComponent();
    this.subscribeToDeviceStatistics();
  }

  ngOnDestroy() {
    if ( this.deviceStatisticsSubscription ) {
      this.deviceStatisticsSubscription.unsubscribe();
    }
  }

  async initializeComponent(): Promise<void> {
    this.devicesInformation = await this.getDevicesInformation();
    this.deviceStatistics = await this.getDevicesStatistics();
    this.updateDeviceInformation();
  }

  async getDevicesInformation(): Promise<DeviceInformation []> {
    return (await this.service.getDevices()).result;
  }

  async getDevicesStatistics() : Promise<DeviceStatistics []> {
    return (await this.service.getDevicesStatistics()).result.map(deviceStats =>  {
      return { 
        ...deviceStats,
        _productionCountRecordedAt: this.datePipe.transform(deviceStats._productionCountRecordedAt,'MMM d, y, h:mm:ss a') || '',
      }
    });
  }

  getDeviceStatisticsByDeviceId( deviceId: string) : DeviceStatistics {
    return this.deviceStatistics.find( deviceStatistics => deviceStatistics._deviceId === deviceId) as DeviceStatistics;
  }

  updateDeviceInformation(): void {
    this.devicesInformation = this.devicesInformation.map(deviceInfo => {
      return {
        ...deviceInfo,
        deviceStatistics: this.deviceStatistics.find( deviceStatistics => deviceStatistics._deviceId === deviceInfo._deviceId) || null,
      }
    });
  }

  subscribeToDeviceStatistics(): void{
    this.deviceStatisticsSubscription = this.service.getDeviceStatistics()
    .subscribe((deviceStats) =>{
      this.deviceStatistics = this.deviceStatistics.map(deviceStatistics => {
        return deviceStats._deviceId === deviceStatistics._deviceId ? deviceStats : deviceStatistics;
      })
      this.updateDeviceInformation();
    })
  }

}
