import { ListagemPageModule } from './listagem/listagem.module';
import { AddPage } from './add/add';
import { LoginPage } from './login/login';
import { ListagemPage } from './listagem/listagem';
import { DetailPage } from './detail/detail';
import { CodigoPage } from './codigo/codigo';
import { HomePage } from './home/home.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),

  }, 
  {
    path:'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'pontos',
    loadChildren: () => import('./listagem/listagem.module').then(m => m.ListagemPageModule)
  },  
  {
    path: 'config',
    loadChildren: () => import('./configuracao/configuracao.module').then(m => m.ConfiguracaoPageModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./add/add.module').then(m => m.AddPageModule)
  },
  {
    path: 'code',
    loadChildren: () => import('./codigo/codigo.module').then(m => m.CodigoPageModule)
  },
  {
    path: '/detail', 
    loadChildren: () => import('./detail/detail.module').then(m => m.DetailPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'listagem',
    loadChildren: () => import('./listagem/listagem.module').then( m => m.ListagemPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'codigo',
    loadChildren: () => import('./codigo/codigo.module').then( m => m.CodigoPageModule)
  },
  {
    path: 'configuracao',
    loadChildren: () => import('./configuracao/configuracao.module').then( m => m.ConfiguracaoPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
