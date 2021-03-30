import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Response, DeviceInformation, DeviceStatistics } from './interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    private socket: Socket,
    private http: HttpClient
    ) { }

  public getDeviceStatistics() {
    return  new Observable<DeviceStatistics>((observer ) => {
      this.socket.on('DeviceStatistics', (deviceStatistics: DeviceStatistics) => {
        observer.next(deviceStatistics);
      });
    });
  }

  public getDevices() {
    return this.http.get<Response<DeviceInformation []>>(`/api/deviceInformation`)
    .toPromise();
  }
  public getDevicesStatistics() {
    return this.http.get<Response<DeviceStatistics []>>(`/api/deviceStatistics`)
    .toPromise();
  }
}
