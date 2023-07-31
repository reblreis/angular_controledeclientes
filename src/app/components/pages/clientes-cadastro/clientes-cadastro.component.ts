import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-clientes-cadastro',
  templateUrl: './clientes-cadastro.component.html',
  styleUrls: ['./clientes-cadastro.component.css'],
})
export class ClientesCadastroComponent {
  //atributos
  possuiEndereco: boolean = true;

  constructor(
    private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService
  ) {}

  /* definindo o formulário */
  formCadastro = new FormGroup({
    /* dados principais do cliente */
    nome: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    dataNascimento: new FormControl('', [Validators.required]),
    plano: new FormControl('', [Validators.required]),
    /* dados do endereço do cliente */
    cep: new FormControl('', []),
    logradouro: new FormControl('', []),
    numero: new FormControl('', []),
    complemento: new FormControl('', []),
    bairro: new FormControl('', []),
    cidade: new FormControl('', []),
    uf: new FormControl('', []),
  });

  /* função para acessar os campos do formulário */
  get form(): any {
    return this.formCadastro.controls;
  }

  /* função para capturar o submit */
  onSubmit(): void {
    console.log(this.formCadastro.value);
  }

  /* função para capturar o click do radio button */
  onRadioButtonClick(event: any): void {
    const value = event.srcElement.value;
    this.possuiEndereco = value == 1;
  }

  /*  função para capturar o input do radio button */
  onCepInput(event: any): void {
    const value = event.srcElement.value;
    if (value.length == 9) {
      this.spinnerService.show();
      this.httpClient
        .get(`${environment.apiViaCep}/${value}/json`)
        .subscribe({
          next: (data: any) => {
            this.formCadastro.controls['logradouro'].setValue(data.logradouro);
            this.formCadastro.controls['bairro'].setValue(data.bairro);
            this.formCadastro.controls['cidade'].setValue(data.localidade);
            this.formCadastro.controls['uf'].setValue(data.uf);
          },
        })
        .add(() => {
          this.spinnerService.hide();
        });
    } else {
      this.formCadastro.controls['logradouro'].setValue('');
      this.formCadastro.controls['bairro'].setValue('');
      this.formCadastro.controls['cidade'].setValue('');
      this.formCadastro.controls['uf'].setValue('');
    }
  }
}