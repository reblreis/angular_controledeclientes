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

  //atributos para captura do upload do arquivo
  arquivo: File | null = null;
  arquivoMsgErro: string = '';

  //mensagem da página
  mensagem: string = '';

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
    const planoSelect = $(this.planoSelect.nativeElement)
      .select2({
        theme: 'bootstrap-5',
      })
      .on('change', () => {
        this.form.plano.setValue(planoSelect.val());
        this.form.plano.updateValueAndValidity();
      });

    //aplicar o estilo 'select2' no campo de seleção de tipo
    const tipoSelect = $(this.tipoSelect.nativeElement)
      .select2({
        theme: 'bootstrap-5',
      })
      .on('change', () => {
        this.form.tipo.setValue(tipoSelect.val());
        this.form.tipo.updateValueAndValidity();
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
    tipo: new FormControl('', [Validators.required]),

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

    /* dados do arquivo (upload) */
    arquivo: new FormControl(null, [Validators.required]),
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
    this.spinnerService.show();

    //criando um FormData
    const formData = new FormData();

    //adicionando os campos que serão enviados para a API
    formData.append('nome', this.formCadastro.value.nome as string);
    formData.append('cpf', this.formCadastro.value.cpf as string);
    formData.append('telefone', this.formCadastro.value.telefone as string);
    formData.append(
      'dataNascimento',
      this.formCadastro.value.dataNascimento as string
    );
    formData.append('plano', this.formCadastro.value.plano as string);
    formData.append('tipo', this.formCadastro.value.plano as string);

    if (this.possuiEndereco) {
      formData.append('cep', this.formCadastro.value.cep as string);
      formData.append(
        'logradouro',
        this.formCadastro.value.logradouro as string
      );
      formData.append('numero', this.formCadastro.value.numero as string);
      formData.append(
        'complemento',
        this.formCadastro.value.complemento as string
      );
      formData.append('bairro', this.formCadastro.value.bairro as string);
      formData.append('cidade', this.formCadastro.value.cidade as string);
      formData.append('uf', this.formCadastro.value.uf as string);
    }

    formData.append(
      'nomeDependente',
      this.formCadastro.value.nomeDependente as string
    );
    formData.append(
      'idadeDependente',
      this.formCadastro.value.idadeDependente as string
    );

    const dependentes = this.formCadastro.value.dependentes;
    if (dependentes && dependentes.length > 0) {
      dependentes.forEach((dependente: any, index: number) => {
        formData.append(
          `dependentes[${index}].nomeDependente`,
          dependente.nomeDependente
        );
        formData.append(
          `dependentes[${index}].idadeDependente`,
          dependente.idadeDependente
        );
      });
    }

    if (this.arquivo) {
      formData.append('arquivo', this.arquivo);
    }

    //enviando para a API
    this.httpClient
      .post(environment.apiClientes, formData)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.mensagem = 'Cliente cadastrado com sucesso.';
          this.formCadastro.reset();
        },
        error: (e) => {
          this.mensagem = 'Falha ao cadastrar cliente';
        },
      })
      .add(() => {
        this.spinnerService.hide();
      });
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

  //função para fazer a captura e validação do arquivo
  onFileChange(event: any) {
    //capturar o arquivo selecionado
    const file = event.target.files[0];
    //verificando se algum arquivo foi obtido
    if (file) {
      //verificando se o arquivo é uma imagem
      if (file.type.startsWith('image/')) {
        //verificando o tamanho do arquivo (até 1MB)
        if (file.size <= 1024 * 1024) {
          //capturando o arquivo
          this.arquivo = file;
          this.arquivoMsgErro = '';
        } else {
          this.formCadastro.controls['arquivo'].setValue(null);
          this.arquivoMsgErro = 'Por favor, envie uma imagem de até 1MB.';
        }
      } else {
        this.formCadastro.controls['arquivo'].setValue(null);
        this.arquivoMsgErro =
          'Por favor, selecione apenas arquivos do tipo imagem.';
      }
    } else {
      //gerar erro
      this.formCadastro.controls['arquivo'].setValue(null);
      this.arquivoMsgErro = 'Por favor, selecione uma foto para upload.';
    }
  }
}
