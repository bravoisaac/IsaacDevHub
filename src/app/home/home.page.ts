import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

type PortfolioScreen = 'home' | 'profile' | 'projects' | 'github' | 'contact';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, RouterLink, IonButton, IonContent, IonIcon],
})
export class HomePage implements OnInit {
  private readonly githubUser = 'bravoisaac';
  private readonly emailServiceId = 'service_idnb5ag';
  private readonly emailTemplateId = 'template_1rhkvq8';
  private readonly emailPublicKey = 'nG1ofkK0Ahmk5oNh5';

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

  constructor(private readonly route: ActivatedRoute) {
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

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.currentScreen = (data['screen'] as PortfolioScreen) || 'home';
    });

    void this.loadGithubProjects();
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
}
