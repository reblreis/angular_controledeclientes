import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-clientes-consulta',
  templateUrl: './clientes-consulta.component.html',
  styleUrls: ['./clientes-consulta.component.css'],
})
export class ClientesConsultaComponent {
  //atributos
  clientes: any[] = []; //todos os clientes
  cliente: any = null; //selecionar 1 cliente
  mensagem: string = ''; //exibir mensagem

  //método construtor
  constructor(
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  //construindo um formulário para capturar os filtros de busca
  formConsulta = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  //função para acessar os elementos do formulário na página
  get form(): any {
    return this.formConsulta.controls;
  }

  //função para capturar o SUBMIT do formulário
  onSubmit(): void {
    //exibindo o spinner (carregando)
    this.spinner.show();

    //capturando o nome preenchido no formulário
    const nome = this.formConsulta.value.nome as string;

    //enviando a requisição de consulta para a API
    this.httpClient
      .get(`${environment.apiClientes}/${nome}`)
      .subscribe({
        //capturando o retorno da API
        next: (data) => {
          //guardar o retorno obtido no atributo 'clientes'
          this.clientes = data as any[];
          if (this.clientes.length > 0)
            this.mensagem = `Foram encontrados ${this.clientes.length} clientes para a busca realizada.`;
          else
            this.mensagem = `Nenhum cliente foi encontrado para a busca realizada.`;
        },
        error: (e) => {
          this.mensagem = 'Falha ao realizar a consulta.';
        },
      })
      .add(() => {
        this.spinner.hide(); //ocultando o spinner
      });
  }

  //função para capturar o click do botão
  //para exibir os dados do cliente na modal
  onButtonClick(cliente: any): void {
    this.cliente = cliente;
  }
}