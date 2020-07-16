import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionStoreComponent } from './session-store.component';

describe('SessionStoreComponent', () => {
  let component: SessionStoreComponent;
  let fixture: ComponentFixture<SessionStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
