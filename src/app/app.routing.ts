import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesCadastroComponent } from './components/pages/clientes-cadastro/clientes-cadastro.component';
import { ClientesConsultaComponent } from './components/pages/clientes-consulta/clientes-consulta.component';

const routes: Routes = [
  {
    path: 'clientes-cadastro',
    component: ClientesCadastroComponent,
  },
  {
    path: 'clientes-consulta',
    component: ClientesConsultaComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'clientes-consulta',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}