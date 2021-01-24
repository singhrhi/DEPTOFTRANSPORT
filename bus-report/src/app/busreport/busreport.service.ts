import { Injectable } from "@angular/core";
import { from, Observable, timer, of } from "rxjs"
import { delay } from "rxjs/operators";

import { BusReportData } from "./data"

@Injectable({
    providedIn: 'root'
})
export class BusreportService {

    getTableData(){
        const delayedObservable = of(BusReportData.data).pipe(delay(2000));
        return delayedObservable;
    }
}