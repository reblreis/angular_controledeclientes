import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesCadastroComponent } from './clientes-cadastro.component';

describe('ClientesCadastroComponent', () => {
  let component: ClientesCadastroComponent;
  let fixture: ComponentFixture<ClientesCadastroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientesCadastroComponent]
    });
    fixture = TestBed.createComponent(ClientesCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
