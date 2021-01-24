interface IBusTableData {
    busId : string;
    routeVariant : string;
    deviationFromTimetable : number;
}

export interface IBusData {
    isNotes: boolean,
    noteVal: string,
    data: IBusTableData[]
}

export interface IBusReportData {
    organisation : string;
    date : string;
    clicked: boolean;
    busData : IBusData;   
}

export interface IFullBusReportData extends Array <IBusReportData> {}