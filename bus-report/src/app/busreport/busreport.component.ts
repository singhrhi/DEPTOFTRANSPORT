import { Component, OnInit } from '@angular/core';

import { BusreportService } from './busreport.service'
import { IBusReportData, IFullBusReportData } from "./data.modal"


@Component({
  selector: 'app-busreport',
  templateUrl: './busreport.component.html',
  styleUrls: ['./busreport.component.css'],
})

export class BusreportComponent implements OnInit {
  busReportData!: IFullBusReportData;
  show!: boolean;

  constructor(private brservice: BusreportService) { }

  ngOnInit(): void {
    this.show = true;
    this.brservice.getTableData().subscribe(
      (data:any) => {
        this.busReportData = data;
        this.formatData();
        this.show = false;
      }      
    )
  }

  formatData(): void {
    this.busReportData.forEach( (element:IBusReportData) => {
      element.busData.data.forEach( (ele) => {
        if(ele.routeVariant !== "UNKNOWN"){
          let substr = ele.routeVariant.substring(0, 3)
          ele.routeVariant = ele.routeVariant.replace( substr, `<b>${substr}</b>`);
        }      
      })
    })
  }

  checkStatus(statusVal:any): any {
      if(!statusVal){
        return `<span class="text-warning">Status not known</span>`
      }
      if(statusVal < 0){
        return `<span class="text-danger">Early</span>`
      }
      if( (statusVal < 300) || (statusVal.deviationFromTimetable > 0) ){
        return `<span class="text-success">On Time</span>`
      }
      if(statusVal > 300){
        return `<span class="text-primary">Late</span>`
      }
  }

  expandList(orgname:string): void {
    for(let data of this.busReportData){
      if( (data.organisation === orgname) && (!data.clicked) ){
        data.clicked = true;
      }else{
        data.clicked = false;
      }
    }
  }

  saveNotes(note: HTMLTextAreaElement, brData:IBusReportData): void {
    if(note.value){
      brData.busData.isNotes = true;
      brData.busData.noteVal = note.value;
    }
  }

}
