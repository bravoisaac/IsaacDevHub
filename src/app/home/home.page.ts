import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import {
  arrowForwardOutline,
  analyticsOutline,
  briefcaseOutline,
  callOutline,
  codeSlashOutline,
  layersOutline,
  logoGithub,
  mailOutline,
  openOutline,
  personOutline,
  ribbonOutline,
  serverOutline,
  trophyOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import {
  ObsidianCubeRenderer,
  PORTFOLIO_OBSIDIAN_FACES,
} from './obsidian-cube.renderer';
import type { ObsidianCubeFace } from './obsidian-cube.renderer';

interface Project {
  id: number;
  title: string;
  type: string;
  description: string;
  stack: string[];
  repository: string;
  updatedAt: string;
}

interface GithubRepository {
  id: number;
  name: string;
  description: string | null;
  fork: boolean;
  html_url: string;
  language: string | null;
  updated_at: string;
}

interface ContactForm {
  name: string;
  user_email: string;
  message: string;
}

interface TechGroup {
  title: string;
  items: string[];
}

interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  highlights: string[];
}

interface FeaturedCase {
  title: string;
  stack: string;
  description: string;
  result: string;
  repository: string;
}

interface StackFocus {
  title: string;
  icon: string;
  description: string;
  items: string[];
}

interface HeroFeature {
  title: string;
  description: string;
  icon: string;
}

interface MethodStep {
  code: string;
  title: string;
  description: string;
}

interface SignalItem {
  value: string;
  label: string;
}

interface DetailItem {
  title: string;
  description: string;
  icon?: string;
  code?: string;
}

type PortfolioScreen =
  | 'home'
  | 'profile'
  | 'stack'
  | 'experience'
  | 'projects'
  | 'github'
  | 'contact';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, RouterLink, IonButton, IonContent, IonIcon],
})
export class HomePage implements AfterViewInit, OnDestroy, OnInit {
  private readonly githubUser = 'bravoisaac';
  private readonly emailServiceId = 'service_idnb5ag';
  private readonly emailTemplateId = 'template_1rhkvq8';
  private readonly emailPublicKey = 'nG1ofkK0Ahmk5oNh5';
  private obsidianCube?: ObsidianCubeRenderer;

  @ViewChild('obsidianCubeCanvas')
  private obsidianCubeCanvas?: ElementRef<HTMLCanvasElement>;

  currentScreen: PortfolioScreen = 'home';

  readonly skills = [
    'Python',
    'JavaScript',
    'TypeScript',
    'PHP',
    'SQL',
    'Angular',
    'Ionic',
    'Laravel',
    'Flask',
    'Node.js',
    'Express',
    'MySQL',
    'AWS',
    'Power BI',
    'Power Automate',
    'Git',
  ];

  readonly techGroups: TechGroup[] = [
    {
      title: 'Lenguajes',
      items: ['Python', 'JavaScript', 'TypeScript', 'PHP', 'SQL'],
    },
    {
      title: 'Frontend',
      items: ['Angular', 'Ionic', 'HTML5', 'CSS3', 'Responsive UI'],
    },
    {
      title: 'Backend',
      items: ['Laravel', 'Flask', 'Node.js', 'Express', 'APIs REST', 'Postman'],
    },
    {
      title: 'Datos y Cloud',
      items: ['MySQL', 'AWS Cloud Practitioner', 'Power BI', 'Excel Avanzado'],
    },
    {
      title: 'Automatizacion y gestion',
      items: ['Power Automate', 'Git', 'GitHub', 'Scrum', 'Kanban'],
    },
  ];

  readonly stackFocus: StackFocus[] = [
    {
      title: 'Backend y APIs',
      icon: 'server-outline',
      description:
        'Construccion de servicios, endpoints REST y logica de negocio para aplicaciones internas y productos web.',
      items: ['Laravel', 'Flask', 'Node.js', 'Express', 'APIs REST', 'Postman'],
    },
    {
      title: 'Frontend y mobile',
      icon: 'layers-outline',
      description:
        'Interfaces responsive con Angular e Ionic, enfocadas en navegacion clara, componentes reutilizables y experiencia de usuario.',
      items: ['Angular', 'Ionic', 'TypeScript', 'HTML5', 'CSS3', 'Responsive UI'],
    },
    {
      title: 'Datos y automatizacion',
      icon: 'analytics-outline',
      description:
        'Optimizacion de consultas, reporteria y flujos automatizados para reducir tareas manuales y mejorar trazabilidad.',
      items: ['MySQL', 'Power BI', 'Power Automate', 'Python', 'Excel Avanzado', 'AWS'],
    },
  ];

  readonly heroFeatures: HeroFeature[] = [
    {
      title: 'Backend verificable',
      description: 'APIs, reglas de negocio y consultas MySQL con trazabilidad.',
      icon: 'server-outline',
    },
    {
      title: 'Automatizacion aplicada',
      description: 'Flujos internos para reducir tareas manuales y conectar procesos.',
      icon: 'analytics-outline',
    },
    {
      title: 'Producto responsive',
      description: 'Interfaces Angular/Ionic claras para web y mobile.',
      icon: 'layers-outline',
    },
    {
      title: 'Mejora medible',
      description: 'Optimizacion enfocada en tiempos de respuesta e impacto operativo.',
      icon: 'trophy-outline',
    },
  ];

  readonly heroSignals: SignalItem[] = [
    { value: 'Disponible', label: 'presencial, hibrido o remoto' },
    { value: 'Chile', label: 'colaboracion para equipos LATAM' },
    { value: 'Producto', label: 'backend, datos y experiencia usable' },
  ];

  readonly deliveryHighlights: DetailItem[] = [
    {
      title: 'Codigo mantenible',
      description: 'Componentes claros, nombres consistentes y flujo facil de extender.',
      icon: 'code-slash-outline',
    },
    {
      title: 'Datos confiables',
      description: 'Consultas, validaciones y trazabilidad pensadas para operacion real.',
      icon: 'server-outline',
    },
    {
      title: 'Entrega usable',
      description: 'Interfaces responsive, documentacion breve y foco en el proceso principal.',
      icon: 'layers-outline',
    },
  ];

  readonly professionalProof: SignalItem[] = [
    { value: '20k+', label: 'registros optimizados en MySQL' },
    { value: '30%', label: 'mejora aproximada en consultas' },
    { value: '100+', label: 'usuarios atendidos en soporte TI' },
    { value: 'AWS', label: 'formacion cloud practitioner' },
  ];

  readonly stackWorkflow: DetailItem[] = [
    {
      code: '01',
      title: 'Modelar',
      description: 'Entender datos, permisos, casos de uso y reglas de negocio.',
    },
    {
      code: '02',
      title: 'Construir',
      description: 'APIs, UI responsive e integraciones con una base simple de mantener.',
    },
    {
      code: '03',
      title: 'Medir',
      description: 'Revisar tiempos, errores, trazabilidad y mejoras de uso.',
    },
  ];

  readonly projectQuality: DetailItem[] = [
    {
      title: 'Repositorios revisables',
      description: 'Codigo publico para evaluar estructura, stack y evolucion de cada proyecto.',
    },
    {
      title: 'Problemas concretos',
      description: 'Casos orientados a automatizacion, datos, postulaciones y operacion interna.',
    },
    {
      title: 'Base escalable',
      description: 'Separacion entre frontend, backend, APIs y fuentes externas cuando aplica.',
    },
  ];

  readonly contactHighlights: SignalItem[] = [
    { value: '24-48h', label: 'respuesta estimada' },
    { value: 'Remoto', label: 'o hibrido segun el proyecto' },
    { value: 'CV', label: 'descargable desde el sitio' },
  ];

  readonly methodFlow: MethodStep[] = [
    {
      code: '01',
      title: 'Diagnosticar',
      description: 'Definir objetivo, usuarios, datos y restricciones tecnicas.',
    },
    {
      code: '02',
      title: 'Prototipar',
      description: 'Validar rapido el flujo principal con una version funcional.',
    },
    {
      code: '03',
      title: 'Optimizar',
      description: 'Mejorar consultas, integraciones y experiencia de uso.',
    },
    {
      code: '04',
      title: 'Publicar',
      description: 'Preparar entrega, documentacion y seguimiento operativo.',
    },
  ];

  readonly experience: ExperienceItem[] = [
    {
      role: 'Desarrollador / Soporte TI',
      organization: 'Unidad TI, JUNJI Chile',
      period: '2024 - 2025',
      highlights: [
        'Desarrollo y soporte de sistema de inventario institucional con Python, Flask y MySQL.',
        'Optimizacion de procesos administrativos, reduciendo tiempos operativos en aproximadamente 20%.',
        'Automatizacion de flujos internos con Power Automate para correos, validacion documental y trazabilidad.',
        'Optimizacion de consultas MySQL sobre tablas con mas de 20 mil registros, mejorando tiempos de respuesta en aproximadamente 30%.',
      ],
    },
    {
      role: 'Soporte TI / Mesa de Ayuda',
      organization: 'Unidad TI, Duoc UC',
      period: '2023',
      highlights: [
        'Atencion tecnica a estudiantes, docentes y funcionarios con mas de 100 usuarios atendidos.',
        'Resolucion de incidencias de hardware, software y conectividad para asegurar continuidad operativa.',
        'Configuracion y mantencion de equipos computacionales y plataformas institucionales.',
      ],
    },
  ];

  readonly featuredCases: FeaturedCase[] = [
    {
      title: 'Mineria de Datos Agricolas',
      stack: 'Python + Pandas + Scikit-learn + Matplotlib + Plotly + MySQL',
      description:
        'Analisis y prediccion climatica para apoyar la gestion agricola mediante mineria de datos y machine learning.',
      result:
        'Modelos de regresion, clasificacion y clustering, alcanzando R2 de hasta 0.96 en modelos de regresion.',
      repository: 'https://github.com/bravoisaac/Mineria_datos',
    },
    {
      title: 'Gestion de postulaciones laborales con IA',
      stack: 'Angular + Node.js + Express + OpenAI API',
      description:
        'Aplicacion web para gestionar postulaciones, puntuar empleos, generar mensajes y automatizar busquedas con IA.',
      result:
        'Frontend Angular y backend Node.js/Express integrando APIs de IA para acelerar procesos de postulacion laboral.',
      repository: 'https://github.com/bravoisaac/Postular_app',
    },
  ];

  readonly education = [
    'Ingenieria en Informatica - Duoc UC, 2021 - 2025',
    'Tecnico en Redes Computacionales - Emplea, 2019',
  ];

  readonly certifications = [
    'AWS Cloud Practitioner Essentials - Amazon Web Services',
    'Fundamentals of Analytics on AWS Part 1 & 2 - Amazon Web Services',
  ];

  readonly experienceMetrics = [
    { value: '2024-2025', label: 'Desarrollo y soporte TI en JUNJI' },
    { value: '100+', label: 'usuarios atendidos en mesa de ayuda' },
    { value: '20k+', label: 'registros trabajados en MySQL' },
  ];

  projects: Project[] = [];
  projectFilters = ['Todos'];
  selectedFilter = 'Todos';
  loadingProjects = true;
  projectsError = '';

  contactForm: ContactForm = {
    name: '',
    user_email: '',
    message: '',
  };
  contactStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';

  readonly stats = [
    { value: '20k+', label: 'registros optimizados' },
    { value: '30%', label: 'mejora en consultas' },
    { value: 'AWS', label: 'cloud practitioner' },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ngZone: NgZone,
  ) {
    addIcons({
      arrowForwardOutline,
      analyticsOutline,
      briefcaseOutline,
      callOutline,
      codeSlashOutline,
      layersOutline,
      logoGithub,
      mailOutline,
      openOutline,
      personOutline,
      ribbonOutline,
      serverOutline,
      trophyOutline,
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.currentScreen = (data['screen'] as PortfolioScreen) || 'home';

      if (this.currentScreen !== 'home') {
        this.destroyObsidianCube();
      }
    });

    void this.loadGithubProjects();
  }

  ngAfterViewInit(): void {
    this.initializeObsidianCube();
  }

  ionViewDidEnter(): void {
    this.initializeObsidianCube();
  }

  ionViewDidLeave(): void {
    this.destroyObsidianCube();
  }

  ngOnDestroy(): void {
    this.destroyObsidianCube();
  }

  get filteredProjects(): Project[] {
    if (this.selectedFilter === 'Todos') {
      return this.projects;
    }

    return this.projects.filter((project) => project.type === this.selectedFilter);
  }

  setProjectFilter(language: string): void {
    this.selectedFilter = language;
  }

  async sendContactMessage(): Promise<void> {
    this.contactStatus = 'sending';

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: this.emailServiceId,
          template_id: this.emailTemplateId,
          user_id: this.emailPublicKey,
          template_params: {
            name: this.contactForm.name,
            user_email: this.contactForm.user_email,
            message: this.contactForm.message,
            time: new Date().toLocaleString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('EmailJS request failed');
      }

      this.contactForm = {
        name: '',
        user_email: '',
        message: '',
      };
      this.contactStatus = 'success';
    } catch {
      this.contactStatus = 'error';
    }
  }

  private async loadGithubProjects(): Promise<void> {
    this.loadingProjects = true;
    this.projectsError = '';

    try {
      const response = await fetch(
        `https://api.github.com/users/${this.githubUser}/repos?sort=updated&per_page=100`,
      );

      if (!response.ok) {
        throw new Error('GitHub request failed');
      }

      const repositories = (await response.json()) as GithubRepository[];
      const publicProjects = repositories
        .filter((repository) => !repository.fork)
        .map((repository) => this.mapRepositoryToProject(repository));

      this.projects = publicProjects;
      this.projectFilters = [
        'Todos',
        ...Array.from(new Set(publicProjects.map((project) => project.type))),
      ];
    } catch {
      this.projectsError =
        'No se pudieron cargar los proyectos desde GitHub en este momento.';
    } finally {
      this.loadingProjects = false;
    }
  }

  private mapRepositoryToProject(repository: GithubRepository): Project {
    const language = repository.language || 'Texto';

    return {
      id: repository.id,
      title: repository.name,
      type: language,
      description:
        repository.description ||
        'Repositorio publico disponible en GitHub para revisar codigo, historial y tecnologias usadas.',
      stack: [language],
      repository: repository.html_url,
      updatedAt: repository.updated_at,
    };
  }

  private initializeObsidianCube(): void {
    if (this.obsidianCube || !this.obsidianCubeCanvas || this.currentScreen !== 'home') {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.obsidianCube = new ObsidianCubeRenderer(
        this.obsidianCubeCanvas!.nativeElement,
        PORTFOLIO_OBSIDIAN_FACES,
        (face) => this.navigateFromCube(face),
      );
      this.obsidianCube.init();
    });
  }

  private destroyObsidianCube(): void {
    this.obsidianCube?.destroy();
    this.obsidianCube = undefined;
  }

  private navigateFromCube(face: ObsidianCubeFace): void {
    this.ngZone.run(() => {
      void this.router.navigateByUrl(face.route);
    });
  }
}
