import { ComponentFixture, TestBed } from '@angular/core/testing';
import { from } from 'rxjs';
import { By } from '@angular/platform-browser'

import { BusreportComponent } from './busreport.component';
import { BusreportService } from './busreport.service';


describe('BusreportComponent Unit test cases', () => {
  let component: BusreportComponent;
  let brservice: BusreportService;

  beforeEach(()=>{
    brservice = new BusreportService();
    component = new BusreportComponent(brservice);
  })

  describe('ngOnInit', ()=>{

    it('should set component property with the items return from service call', ()=>{
      let arr: any = [{
        "organisation":"Sydney Buses",
        "date":"25/09/2015",
        "clicked":false,
        "busData":{"isNotes":false, "noteVal":'', "data":[]}
      }]

      spyOn(brservice, 'getTableData').and.returnValue(from([arr]));
      let spy = spyOn(component, 'formatData');

      component.ngOnInit();

      expect(component.busReportData.indexOf(arr[0])).toBeGreaterThan(-1);
      expect(spy).toHaveBeenCalled();
    })

  })

  describe('checkStatus', () => {
    let statusVal;

    it('should return status not known', () => {
      statusVal = null;
      let check = component.checkStatus(statusVal);
  
      expect(check).toEqual('<span class="text-warning">Status not known</span>');
    })
  
    it('should return status not known', () => {
      statusVal = undefined;
      let check = component.checkStatus(statusVal);
  
      expect(check).toEqual('<span class="text-warning">Status not known</span>');
    })
  
    it('should return status not known', () => {
      statusVal = '';
      let check = component.checkStatus(statusVal);
  
      expect(check).toEqual('<span class="text-warning">Status not known</span>');
    })
  
    it('should return Late', () => {
      statusVal = 150;
      let check = component.checkStatus(statusVal);
  
      expect(check).toEqual('<span class="text-success">On Time</span>');
    })
  
    it('should return On Time', () => {
      statusVal = 310;
      let check = component.checkStatus(statusVal);
  
      expect(check).toEqual('<span class="text-primary">Late</span>');
    })

  })

  describe('saveNotes', ()=>{
    let note: any;
    let brData: any;

    it('should set brData if note.value is valid',()=>{
      note  = {value: 'test'}
      brData = {
        "busData":{
          "isNotes":false,
          "noteVal":'',
          "data":[]
        }
      }

      component.saveNotes(note, brData);

      expect(brData.busData.isNotes).toBe(true);
      expect(brData.busData.noteVal).toBe(note.value);

    })

  })

  describe('expandList', ()=>{
    let orgname: string;

    it('should set data.clicked true when clicked false and busReportData.organisation is equal to orgname', ()=>{
      component.busReportData = [
        {
          "organisation":"Sydney Buses",
          "date":"25/09/2015",
          "clicked":false,
          "busData":{"isNotes":false, "noteVal":'', "data":[]}
        },
      ]
      orgname = "Sydney Buses";

      component.expandList(orgname);

      expect(component.busReportData[0].clicked).toBe(true);

    })

    it('should set data.clicked true when clicked true and busReportData.organisation is not to orgname', ()=>{
      component.busReportData = [
        {
          "organisation":"Central Buses",
          "date":"25/09/2015",
          "clicked":true,
          "busData":{"isNotes":false, "noteVal":'', "data":[]}
        },
      ]
      orgname = "Sydney Buses";

      component.expandList(orgname);

      expect(component.busReportData[0].clicked).toBe(false);

    })

  })

  describe('formatData', ()=>{

    it('should set three initial characters of string routeVariant to bold', ()=>{
      component.busReportData = [
        {
          "organisation":"Sydney Buses",
          "date":"25/09/2015",
          "clicked":false,
          "busData":{"isNotes":false, "noteVal":'', "data":[{
            "busId":"62788",
            "routeVariant":"666 2 1",
            "deviationFromTimetable":123
          },]}
        },
      ]

      let str = component.busReportData[0].busData.data[0].routeVariant;
      let substr = str.substring(0, 3);
      str = str.replace( substr, `<b>${substr}</b>`);

      component.formatData();

      expect(str).toEqual(`${component.busReportData[0].busData.data[0].routeVariant}`);

    })

    it('should not set three initial characters of string routeVariant to bold', ()=>{
      component.busReportData = [
        {
          "organisation":"Sydney Buses",
          "date":"25/09/2015",
          "clicked":false,
          "busData":{"isNotes":false, "noteVal":'', "data":[{
            "busId":"62788",
            "routeVariant":"UNKNOWN",
            "deviationFromTimetable":123
          },]}
        },
      ]

      component.formatData();

      expect('UNKNOWN').toEqual(`${component.busReportData[0].busData.data[0].routeVariant}`);

    })

  })

})

describe('BusreportComponent Integration test cases', () => {
  let component: BusreportComponent;
  let fixture: ComponentFixture<BusreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BusreportComponent ]
    })

    fixture = TestBed.createComponent(BusreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create BusreportComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render Bus Reports', () => {
    let de = fixture.debugElement.query(By.css('.h2'));
    let el:HTMLElement = de.nativeElement;

    expect(el.innerText).toContain('Bus Reports');
  });

  it('should render Loading...', () => {
    component.show = true;
    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('span'));
    let el:HTMLElement = de.nativeElement;

    expect(el.innerText).toContain('Loading...');
  });

  it('should render NO BUS DATA!', () => {
    component.busReportData = [
      {
        "organisation":"Sydney Buses",
        "date":"25/09/2015",
        "clicked":true,
        "busData":{"isNotes":false, "noteVal":'', "data":[]}
      },
    ]
    component.show = false;
    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.text-center'));
    let el: HTMLElement = de.nativeElement;

    expect(el.textContent).toBe(' No BUS DATA! ');

  });

  it('text area should have the value attibute populated with the string from user and be disabled when isNotes is true', () => {
    component.busReportData = [
      {
        "organisation":"Sydney Buses",
        "date":"25/09/2015",
        "clicked":true,
        "busData":{"isNotes":true, "noteVal":'test', "data":[{
          "busId":"94811",
          "routeVariant":"664 2 1",
          "deviationFromTimetable":164
        }]}
      },
    ]
    component.show = false;
    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.form-control'));
    let el: HTMLTextAreaElement = de.nativeElement;

    expect(el.value).toBe('test');
    expect(el.disabled).toBe(true);

  });

  it('text area should have the value attibute populated with the string from user and be disabled when isNotes is true', () => {
    component.busReportData = [
      {
        "organisation":"Sydney Buses",
        "date":"25/09/2015",
        "clicked":true,
        "busData":{"isNotes":true, "noteVal":'test', "data":[{
          "busId":"94811",
          "routeVariant":"664 2 1",
          "deviationFromTimetable":164
        }]}
      },
    ]
    component.show = false;
    fixture.detectChanges();

    let textArea = fixture.debugElement.query(By.css('.form-control'));
    let ta: HTMLTextAreaElement = textArea.nativeElement;


    let button = fixture.debugElement.query(By.css('button'));
    let el: HTMLButtonElement = button.nativeElement;

    button.triggerEventHandler('click', null);

    expect(el.disabled).toBe(true);
    expect(ta.disabled).toBe(true);

  });

  it('should display organisation and name', () => {
    component.busReportData = [
      {
        "organisation":"Sydney Buses",
        "date":"25/09/2015",
        "clicked":true,
        "busData":{"isNotes":true, "noteVal":'test', "data":[{
          "busId":"94811",
          "routeVariant":"664 2 1",
          "deviationFromTimetable":164
        }]}
      },
    ]
    component.show = false;
    fixture.detectChanges();

    let a = fixture.debugElement.query(By.css('a'));
    let ha: HTMLElement = a.nativeElement;

    expect(ha.textContent).not.toBe(null);

  });

  it('check angle up and down', () => {
    component.busReportData = [
      {
        "organisation":"Sydney Buses",
        "date":"25/09/2015",
        "clicked":true,
        "busData":{"isNotes":true, "noteVal":'test', "data":[{
          "busId":"94811",
          "routeVariant":"664 2 1",
          "deviationFromTimetable":164
        }]}
      },
    ]
    component.show = false;
    fixture.detectChanges();

    let t = fixture.debugElement.query(By.css('.table'));
    let ht: HTMLTableElement = t.nativeElement;

    expect(ht.innerHTML).not.toBe('');

  });

});
