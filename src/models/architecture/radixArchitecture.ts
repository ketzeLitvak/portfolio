import type { ArchitectureProject } from './architecture';

export const radixArchitecture: ArchitectureProject = {
  id: 'radix',
  title: 'Radix',
  logo: './assets/radix-logo.png',
  description: [
    'From city data to a location score. Explore the components and follow a lookup.',
    'De los datos de la ciudad al score de un local. Explorá los componentes y seguí una consulta.',
  ],
  source: [
    'Simplified logical view · Architecture document V1.0 · July 2026',
    'Vista lógica simplificada · Documento de arquitectura V1.0 · Julio 2026',
  ],
  nodes: [
    {
      id: 'sources',
      icon: 'sources',
      row: 1,
      column: 1,
      title: ['External sources', 'Fuentes externas'],
      subtitle: ['Venues, demographics, mobility', 'Locales, demografía, movilidad'],
      technology: ['Data sources'],
      role: [
        'Provide the raw location data used by Radix: venues, demographic information, mobility, competition and points of interest.',
        'Aportan los datos de ubicaciones que usa Radix: locales, información demográfica, movilidad, competencia y puntos de interés.',
      ],
      input: ['External datasets and APIs.', 'Datasets y APIs externas.'],
      output: [
        'Raw observations for the data pipeline.',
        'Observaciones sin procesar para el pipeline.',
      ],
      rationale: [
        'External API adapters keep provider formats and integration details outside the business logic.',
        'Los adapters de APIs externas mantienen los formatos y detalles de cada proveedor fuera de la lógica de negocio.',
      ],
    },
    {
      id: 'pipeline',
      icon: 'pipeline',
      row: 1,
      column: 2,
      title: ['Data & scoring', 'Datos y scoring'],
      subtitle: ['Clean, enrich, evaluate', 'Limpiar, enriquecer, evaluar'],
      technology: ['Python', 'Data engineering'],
      role: [
        'The data engineering engine prepares analytical variables. The scoring component uses the prepared data to produce evaluations. This card groups both responsibilities.',
        'El motor de ingeniería de datos prepara variables analíticas. El componente de scoring usa los datos preparados para producir evaluaciones. Esta tarjeta agrupa ambas responsabilidades.',
      ],
      input: [
        'Raw data and analytical scoring criteria.',
        'Datos sin procesar y criterios de evaluación analítica.',
      ],
      output: [
        'Prepared metrics, features and evaluation results.',
        'Métricas, features y resultados de evaluación preparados.',
      ],
      rationale: [
        'Analytical processing evolves separately from the transactional backend, so changing data transformations does not require changing the web interface.',
        'El procesamiento analítico evoluciona separado del backend transaccional: cambiar transformaciones de datos no requiere cambiar la interfaz web.',
      ],
    },
    {
      id: 'gold',
      icon: 'gold',
      row: 1,
      column: 3,
      title: ['Gold layer', 'Capa Gold'],
      subtitle: ['Consolidated analytical data', 'Datos analíticos consolidados'],
      technology: ['Analytical persistence'],
      role: [
        'Stores the final cleaned and enriched datasets, metrics and evaluations produced by the analytical pipeline.',
        'Guarda los datasets finales, métricas y evaluaciones que produce el pipeline después de limpiar y enriquecer los datos.',
      ],
      input: ['Consolidated analytical results.', 'Resultados analíticos consolidados.'],
      output: [
        'Data ready to feed scoring imports and product features.',
        'Datos preparados para importar scores y alimentar funcionalidades del producto.',
      ],
      rationale: [
        'Gold has an analytical purpose; the operational database has a transactional purpose. This logical separation allows each data model to serve its workload.',
        'Gold tiene una finalidad analítica y la base operativa, una transaccional. Esta separación lógica permite que cada modelo de datos responda a su carga de trabajo.',
      ],
    },
    {
      id: 'workers',
      icon: 'worker',
      row: 2,
      column: 3,
      title: ['Background processing', 'Procesos en segundo plano'],
      subtitle: ['Broker, outbox, workers', 'Broker, outbox, workers'],
      technology: ['Asynchronous processing'],
      role: [
        'The documented design separates scoring imports, report generation and alert evaluation into workers. The outbox publisher and message broker coordinate asynchronous tasks.',
        'El diseño documentado separa la importación de scores, generación de reportes y evaluación de alertas en workers. El outbox publisher y el broker coordinan las tareas asincrónicas.',
      ],
      input: [
        'Published events and analytical results.',
        'Eventos publicados y resultados analíticos.',
      ],
      output: [
        'Operational score updates, reports and evaluated alerts.',
        'Actualizaciones de scores operativos, reportes y alertas evaluadas.',
      ],
      rationale: [
        'Workers keep expensive or deferred work outside the interactive request. The outbox records events in the database before publication to reduce lost work.',
        'Los workers mantienen el trabajo costoso o diferido fuera de la consulta interactiva. El outbox registra los eventos en la base antes de publicarlos para reducir tareas perdidas.',
      ],
    },
    {
      id: 'data',
      icon: 'data',
      row: 2,
      column: 2,
      title: ['Operational data', 'Datos operativos'],
      subtitle: ['Companies, venues, scores', 'Empresas, locales, scores'],
      technology: ['Supabase', 'PostgreSQL'],
      role: [
        'The relational database holds companies, users, venues, criteria, operational scores, alerts, reports and internal events. Identity and object storage are associated product services.',
        'La base relacional guarda empresas, usuarios, locales, criterios, scores operativos, alertas, reportes y eventos internos. Identidad y almacenamiento de archivos son servicios asociados del producto.',
      ],
      input: [
        'Business changes and imported scoring results.',
        'Cambios del negocio y resultados de scoring importados.',
      ],
      output: [
        'Structured product data and references to generated files.',
        'Datos estructurados del producto y referencias a archivos generados.',
      ],
      rationale: [
        'Relational persistence supports consistency, references between entities and structured queries. Files belong in object storage, with their metadata in the database.',
        'La persistencia relacional permite consistencia, relaciones entre entidades y consultas estructuradas. Los archivos van al almacenamiento de objetos y sus metadatos quedan en la base.',
      ],
    },
    {
      id: 'api',
      icon: 'api',
      row: 2,
      column: 1,
      title: ['Backend API', 'API de backend'],
      subtitle: ['Permissions & business rules', 'Permisos y reglas de negocio'],
      technology: ['Node.js', 'REST'],
      role: [
        'Coordinates Radix operations: checks permissions, applies business rules, reads and writes data, and initiates asynchronous processes when required.',
        'Coordina las operaciones de Radix: valida permisos, aplica reglas de negocio, consulta y guarda datos e inicia procesos asincrónicos cuando corresponde.',
      ],
      input: [
        'Requests associated with a user, company and selected venue.',
        'Pedidos asociados a un usuario, una empresa y un local elegido.',
      ],
      output: [
        'Authorized responses for venues, scores, reports and other product operations.',
        'Respuestas autorizadas de locales, scores, reportes y otras operaciones del producto.',
      ],
      rationale: [
        'The REST contract separates presentation from business logic. The API owns authorization decisions instead of relying on hidden interface controls.',
        'El contrato REST separa la presentación de la lógica de negocio. La API valida la autorización en vez de depender de controles ocultos en la interfaz.',
      ],
    },
    {
      id: 'web',
      icon: 'web',
      row: 3,
      column: 1,
      title: ['Web application', 'Aplicación web'],
      subtitle: ['Map, scores, reports', 'Mapa, scores, reportes'],
      technology: ['Next.js', 'React', 'TypeScript'],
      role: [
        'Lets users explore venues, inspect scores, manage criteria and access reports, alerts and simulations according to their role.',
        'Permite explorar locales, consultar scores, gestionar criterios y acceder a reportes, alertas y simulaciones según el rol del usuario.',
      ],
      input: ['User actions and API responses.', 'Acciones del usuario y respuestas de la API.'],
      output: [
        'Requests to the backend and a visual explanation of location results.',
        'Pedidos al backend y una presentación visual de los resultados de ubicaciones.',
      ],
      rationale: [
        'A web interface makes the product accessible across devices without installation, while keeping central business rules in the backend.',
        'La interfaz web permite acceder desde distintos dispositivos sin instalación y mantiene las reglas centrales del negocio en el backend.',
      ],
    },
  ],
  edges: [
    { id: 'sources-pipeline', from: 'sources', to: 'pipeline', kind: 'data' },
    { id: 'pipeline-gold', from: 'pipeline', to: 'gold', kind: 'data' },
    { id: 'gold-workers', from: 'gold', to: 'workers', kind: 'async' },
    { id: 'workers-data', from: 'workers', to: 'data', kind: 'async', bidirectional: true },
    { id: 'api-data', from: 'api', to: 'data', kind: 'request', bidirectional: true },
    { id: 'web-api', from: 'web', to: 'api', kind: 'request', bidirectional: true },
  ],
  flow: {
    title: ['Look up a location score', 'Consultar el score de un local'],
    steps: [
      {
        title: ['Choose a location', 'Elegir un local'],
        description: [
          'The user selects a venue in the web application. The frontend requests its score for the current company.',
          'El usuario elige un local en la aplicación web. El frontend solicita su score para la empresa actual.',
        ],
        nodes: ['web', 'api'],
        edges: ['web-api'],
        inspect: 'web',
      },
      {
        title: ['Validate access', 'Validar el acceso'],
        description: [
          'The backend verifies the session and the user’s permissions within the company before returning protected information.',
          'El backend valida la sesión y los permisos del usuario dentro de la empresa antes de devolver información protegida.',
        ],
        nodes: ['api'],
        edges: [],
        inspect: 'api',
      },
      {
        title: ['Read the prepared result', 'Consultar el resultado preparado'],
        description: [
          'The API reads the operational score and its components. These results were prepared by the analytical pipeline and imported separately from this lookup.',
          'La API consulta el score operativo y sus componentes. Estos resultados fueron preparados por el pipeline analítico e importados por separado de esta consulta.',
        ],
        nodes: ['api', 'data'],
        edges: ['api-data'],
        inspect: 'data',
      },
      {
        title: ['Explain the score', 'Mostrar el score'],
        description: [
          'The API returns the result. The web application presents the score, its components and calculation date so the user can assess the venue.',
          'La API devuelve el resultado. La aplicación web muestra el score, sus componentes y la fecha de cálculo para que el usuario pueda evaluar el local.',
        ],
        nodes: ['api', 'web'],
        edges: ['web-api'],
        inspect: 'web',
      },
    ],
  },
};
