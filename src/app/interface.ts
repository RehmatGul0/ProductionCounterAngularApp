export interface DeviceInformation {
    _deviceId: string;
    _deviceName: string;
    deviceStatistics ?: DeviceStatistics | null;
}

export interface DeviceStatistics {
    _productionCount: number;
    _productionCountRecordedAt: string;
    _deviceStatus: boolean;
    _deviceId: string;
    _id: string;
}

export interface Response<T> {
    message: string;
    result: T

}