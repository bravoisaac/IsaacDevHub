import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  chatbubbleEllipsesOutline,
  codeSlashOutline,
  compassOutline,
  cubeOutline,
  documentTextOutline,
  folderOpenOutline,
  homeOutline,
  layersOutline,
  logoGithub,
  mailOutline,
  openOutline,
  personCircleOutline,
  personOutline,
  ribbonOutline,
  serverOutline,
  trophyOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

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

interface CubeFace {
  title: string;
  subtitle: string;
  route?: string;
  href?: string;
  icon: string;
  className: string;
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
  imports: [NgClass, FormsModule, RouterLink, IonButton, IonContent, IonIcon],
})
export class HomePage implements OnDestroy, OnInit {
  private readonly githubUser = 'bravoisaac';
  private readonly emailServiceId = 'service_idnb5ag';
  private readonly emailTemplateId = 'template_1rhkvq8';
  private readonly emailPublicKey = 'nG1ofkK0Ahmk5oNh5';

  currentScreen: PortfolioScreen = 'home';
  cubeRotateX = -18;
  cubeRotateY = -34;
  private isRotatingCube = false;
  private cubeStartX = 0;
  private cubeStartY = 0;
  private cubeStartRotateX = 0;
  private cubeStartRotateY = 0;
  private cubeTargetRotateX = -18;
  private cubeTargetRotateY = -34;
  private cubeAnimationFrame = 0;
  private cubeDidDrag = false;

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
      description: 'APIs, reglas de negocio y consultas MySQL pensadas para operar con trazabilidad.',
      icon: 'server-outline',
    },
    {
      title: 'Automatizacion aplicada',
      description: 'Flujos internos que reducen tareas manuales y conectan sistemas administrativos.',
      icon: 'analytics-outline',
    },
    {
      title: 'Producto responsive',
      description: 'Interfaces Angular/Ionic claras, navegables y listas para procesos reales.',
      icon: 'layers-outline',
    },
    {
      title: 'Mejora medible',
      description: 'Trabajo orientado a tiempos de respuesta, continuidad operativa e impacto visible.',
      icon: 'trophy-outline',
    },
  ];

  readonly methodFlow: MethodStep[] = [
    {
      code: '01',
      title: 'Diagnosticar',
      description: 'Entender objetivo, usuarios, datos disponibles y restricciones tecnicas.',
    },
    {
      code: '02',
      title: 'Prototipar',
      description: 'Construir rapido una solucion funcional para validar el flujo principal.',
    },
    {
      code: '03',
      title: 'Optimizar',
      description: 'Mejorar consultas, integraciones, automatizaciones y experiencia de uso.',
    },
    {
      code: '04',
      title: 'Publicar',
      description: 'Preparar despliegue, documentacion, soporte y seguimiento operativo.',
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

  readonly cubeFaces: CubeFace[] = [
    {
      title: 'Inicio',
      subtitle: 'Resumen profesional',
      route: '/home',
      icon: 'compass-outline',
      className: 'face-home',
    },
    {
      title: 'Perfil',
      subtitle: 'Stack y experiencia',
      route: '/perfil',
      icon: 'person-circle-outline',
      className: 'face-profile',
    },
    {
      title: 'Stack',
      subtitle: 'Tecnologias',
      route: '/stack',
      icon: 'cube-outline',
      className: 'face-stack',
    },
    {
      title: 'Experiencia',
      subtitle: 'Trayectoria',
      route: '/experiencia',
      icon: 'trophy-outline',
      className: 'face-experience',
    },
    {
      title: 'Proyectos',
      subtitle: 'GitHub y casos reales',
      route: '/proyectos',
      icon: 'folder-open-outline',
      className: 'face-projects',
    },
    {
      title: 'GitHub',
      subtitle: 'Codigo fuente',
      route: '/github',
      icon: 'logo-github',
      className: 'face-github',
    },
    {
      title: 'Contacto',
      subtitle: 'Trabajemos juntos',
      route: '/contacto',
      icon: 'chatbubble-ellipses-outline',
      className: 'face-contact',
    },
    {
      title: 'CV',
      subtitle: 'Descargar perfil',
      href: 'assets/CV_Isaac_Bravo_FullStack.pdf',
      icon: 'document-text-outline',
      className: 'face-cv',
    },
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
  ) {
    addIcons({
      arrowForwardOutline,
      analyticsOutline,
      briefcaseOutline,
      callOutline,
      chatbubbleEllipsesOutline,
      codeSlashOutline,
      compassOutline,
      cubeOutline,
      documentTextOutline,
      folderOpenOutline,
      homeOutline,
      layersOutline,
      logoGithub,
      mailOutline,
      openOutline,
      personCircleOutline,
      personOutline,
      ribbonOutline,
      serverOutline,
      trophyOutline,
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.currentScreen = (data['screen'] as PortfolioScreen) || 'home';
    });

    void this.loadGithubProjects();
  }

  ngOnDestroy(): void {
    if (this.cubeAnimationFrame) {
      cancelAnimationFrame(this.cubeAnimationFrame);
      this.cubeAnimationFrame = 0;
    }
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

  startCubeRotation(event: PointerEvent): void {
    const stage = event.currentTarget as HTMLElement;
    const startedOnFace =
      event.target instanceof Element && Boolean(event.target.closest('.nav-facet'));

    if (!startedOnFace) {
      stage.setPointerCapture(event.pointerId);
    }

    this.isRotatingCube = true;
    this.cubeDidDrag = false;
    this.cubeStartX = event.clientX;
    this.cubeStartY = event.clientY;
    this.cubeStartRotateX = this.cubeTargetRotateX;
    this.cubeStartRotateY = this.cubeTargetRotateY;
    this.animateCubeRotation();
  }

  rotateCube(event: PointerEvent): void {
    if (!this.isRotatingCube) {
      return;
    }

    const deltaX = event.clientX - this.cubeStartX;
    const deltaY = event.clientY - this.cubeStartY;

    if (Math.hypot(deltaX, deltaY) > 7) {
      this.cubeDidDrag = true;
    }

    this.cubeTargetRotateY = this.cubeStartRotateY + deltaX * 0.22;
    this.cubeTargetRotateX = Math.max(
      -42,
      Math.min(42, this.cubeStartRotateX - deltaY * 0.18),
    );
  }

  stopCubeRotation(event?: PointerEvent): void {
    if (event?.currentTarget) {
      const target = event.currentTarget as HTMLElement;
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }
    }

    this.isRotatingCube = false;
  }

  handleCubeFaceClick(event: MouseEvent, face: CubeFace): void {
    event.preventDefault();

    if (this.cubeDidDrag) {
      event.stopPropagation();
      this.cubeDidDrag = false;
      return;
    }

    if (face.route) {
      void this.router.navigateByUrl(face.route);
      return;
    }

    if (face.href) {
      window.open(face.href, '_blank', 'noreferrer');
    }
  }

  private animateCubeRotation(): void {
    if (this.cubeAnimationFrame) {
      return;
    }

    const step = () => {
      const easing = this.isRotatingCube ? 0.18 : 0.1;

      this.cubeRotateX += (this.cubeTargetRotateX - this.cubeRotateX) * easing;
      this.cubeRotateY += (this.cubeTargetRotateY - this.cubeRotateY) * easing;

      const deltaX = Math.abs(this.cubeTargetRotateX - this.cubeRotateX);
      const deltaY = Math.abs(this.cubeTargetRotateY - this.cubeRotateY);

      if (this.isRotatingCube || deltaX > 0.02 || deltaY > 0.02) {
        this.cubeAnimationFrame = requestAnimationFrame(step);
      } else {
        this.cubeAnimationFrame = 0;
      }
    };

    this.cubeAnimationFrame = requestAnimationFrame(step);
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
}
