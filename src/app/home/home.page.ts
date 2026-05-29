import { Component } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import {
  arrowForwardOutline,
  briefcaseOutline,
  callOutline,
  codeSlashOutline,
  logoGithub,
  mailOutline,
  openOutline,
  personOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

interface Project {
  title: string;
  type: string;
  description: string;
  stack: string[];
  repository: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonContent, IonIcon],
})
export class HomePage {
  readonly skills = [
    'Angular',
    'Ionic',
    'TypeScript',
    'Node.js',
    'Firebase',
    'REST APIs',
    'Git',
    'UI responsive',
  ];

  readonly projects: Project[] = [
    {
      title: 'Panel Administrativo',
      type: 'Web app',
      description:
        'Dashboard para gestionar usuarios, indicadores y operaciones internas con rutas protegidas.',
      stack: ['Angular', 'Ionic', 'Firebase'],
      repository: 'https://github.com/tu-usuario/panel-administrativo',
    },
    {
      title: 'Tienda Digital',
      type: 'Ecommerce',
      description:
        'Catálogo responsive con carrito, filtros de productos y flujo de contacto comercial.',
      stack: ['Angular', 'TypeScript', 'SCSS'],
      repository: 'https://github.com/tu-usuario/tienda-digital',
    },
    {
      title: 'API de Servicios',
      type: 'Backend',
      description:
        'API REST para autenticación, consultas y persistencia de datos con arquitectura modular.',
      stack: ['Node.js', 'Express', 'MongoDB'],
      repository: 'https://github.com/tu-usuario/api-servicios',
    },
  ];

  readonly stats = [
    { value: '12+', label: 'proyectos' },
    { value: '3', label: 'años creando' },
    { value: '100%', label: 'responsive' },
  ];

  constructor() {
    addIcons({
      arrowForwardOutline,
      briefcaseOutline,
      callOutline,
      codeSlashOutline,
      logoGithub,
      mailOutline,
      openOutline,
      personOutline,
    });
  }
}
