import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSettlementsComponent } from './group-settlements.component';

describe('GroupSettlementsComponent', () => {
  let component: GroupSettlementsComponent;
  let fixture: ComponentFixture<GroupSettlementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSettlementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
