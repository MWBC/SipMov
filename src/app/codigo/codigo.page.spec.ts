import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CodigoPage } from './codigo.page';

describe('CodigoPage', () => {
  let component: CodigoPage;
  let fixture: ComponentFixture<CodigoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodigoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CodigoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
