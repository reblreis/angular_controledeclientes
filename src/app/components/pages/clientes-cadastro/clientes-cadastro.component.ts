import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment.development';

declare var $: any; //utilizar o jquery

@Component({
  selector: 'app-clientes-cadastro',
  templateUrl: './clientes-cadastro.component.html',
  styleUrls: ['./clientes-cadastro.component.css'],
})
export class ClientesCadastroComponent implements OnInit, AfterViewInit {
  //atributos
  possuiEndereco: boolean = true;
  planos: any[] = [];
  tipos: any[] = [];

  //capturando elementos da página através do ID (#)
  @ViewChild('planoSelect') planoSelect!: ElementRef;
  @ViewChild('tipoSelect') tipoSelect!: ElementRef;

  constructor(
    private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService
  ) {}

  //função executada antes do componente ser carregado
  ngOnInit(): void {
    //preenchendo os planos
    this.planos.push({ id: 1, nome: 'Plano preferencial' });
    this.planos.push({ id: 2, nome: 'Plano empresa' });
    this.planos.push({ id: 3, nome: 'Plano padrão' });
    this.planos.push({ id: 4, nome: 'Plano vip' });

    //preenchendo os tipos
    this.tipos.push({ id: 1, nome: 'Cliente tipo 1' });
    this.tipos.push({ id: 2, nome: 'Cliente tipo 2' });
    this.tipos.push({ id: 3, nome: 'Cliente tipo 3' });
  }

  //função executada após o carregamento do componente
  ngAfterViewInit(): void {
   
    //aplicar o estilo 'select2' no campo de seleção de plano
    $(this.planoSelect.nativeElement).select2({
      theme: "bootstrap-5"
    });

    //aplicar o estilo 'select2' no campo de seleção de tipo
    $(this.tipoSelect.nativeElement).select2({
      theme: "bootstrap-5"
    });
  }

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

    /* dados dos dependentes */
    nomeDependente: new FormControl(''),
    idadeDependente: new FormControl(''),
    dependentes: new FormArray([]),
  });

  //função para acessar o FormArray
  get formDependentes(): FormArray {
    return this.formCadastro.get('dependentes') as FormArray;
  }

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

  //função para adicionando um dependente
  adicionarDependente(): void {
    //criar um registro dentro do FormArray
    this.formDependentes.push(
      new FormGroup({
        nomeDependente: new FormControl(''),
        idadeDependente: new FormControl(''),
      })
    );
  }

  //função para remover um dependente
  //index => posição do elemento que será removido
  removerDependente(index: number): void {
    this.formDependentes.removeAt(index);
  }

  //função para remover o ultimo dependente
  removerUltimoDependente(): void {
    this.formDependentes.removeAt(this.formDependentes.length - 1);
  }
}