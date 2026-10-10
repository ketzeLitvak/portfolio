import type { ArchitectureProject } from './architecture';

export const radixArchitecture: ArchitectureProject = {
  id: 'radix',
  title: 'Radix',
  logo: './assets/radix-logo.png',
  description: [
    'Medallion architecture: raw data in Bronze, reliable data in Silver, and metrics for scoring in Gold. Follow the transformations into the product.',
    'Arquitectura Medallion: datos crudos en Bronce, datos confiables en Silver y métricas para scoring en Gold. Seguí las transformaciones hasta el producto.',
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
      id: 'bronze',
      icon: 'gold',
      row: 1,
      column: 2,
      title: ['Bronze', 'Bronce'],
      subtitle: ['Raw · Preserve the source', 'Crudos · Conservar la fuente'],
      technology: ['Medallion', 'Raw data'],
      role: [
        'Preserves ingested external data in its original form, before analytical cleaning and enrichment.',
        'Conserva los datos externos ingresados en su forma original, antes de la limpieza y el enriquecimiento analítico.',
      ],
      input: [
        'Datasets and API responses with provider-specific formats.',
        'Datasets y respuestas de APIs con formatos propios de cada proveedor.',
      ],
      output: [
        'Raw data available for subsequent processing.',
        'Datos crudos disponibles para el procesamiento posterior.',
      ],
      rationale: [
        'Keeping the original input allows transformations to be reviewed and processing to be repeated without losing the source.',
        'Conservar la entrada original permite revisar transformaciones y repetir el procesamiento sin perder la fuente.',
      ],
    },
    {
      id: 'silver',
      icon: 'pipeline',
      row: 1,
      column: 3,
      title: ['Silver', 'Silver'],
      subtitle: ['Clean · Standardize and validate', 'Limpios · Normalizar y validar'],
      technology: ['Medallion', 'Python'],
      role: [
        'The data engineering stage cleans, normalizes and enriches Bronze data to create consistent analytical inputs.',
        'La etapa de ingeniería de datos limpia, normaliza y enriquece los datos de Bronce para crear entradas analíticas consistentes.',
      ],
      input: [
        'Raw records with different formats and quality.',
        'Registros crudos con distintos formatos y calidad.',
      ],
      output: [
        'Validated and normalized data that can be combined across sources.',
        'Datos validados y normalizados que pueden combinarse entre fuentes.',
      ],
      rationale: [
        'Quality rules belong before aggregation and scoring: comparable inputs make downstream metrics meaningful.',
        'Las reglas de calidad van antes de la agregación y el scoring: entradas comparables permiten construir métricas útiles.',
      ],
    },
    {
      id: 'gold',
      icon: 'gold',
      row: 1,
      column: 4,
      title: ['Gold layer', 'Capa Gold'],
      subtitle: ['Ready · Metrics and evaluations', 'Listos · Métricas y evaluaciones'],
      technology: ['Analytical persistence'],
      role: [
        'Stores the final cleaned and enriched datasets, metrics and evaluations built from Silver data by the analytical pipeline.',
        'Guarda los datasets finales, métricas y evaluaciones construidos a partir de Silver: agrega y organiza la información para evaluar locales.',
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
      column: 4,
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
      column: 3,
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
      column: 2,
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
      row: 2,
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
    { id: 'sources-bronze', from: 'sources', to: 'bronze', kind: 'data' },
    { id: 'bronze-silver', from: 'bronze', to: 'silver', kind: 'data' },
    { id: 'silver-gold', from: 'silver', to: 'gold', kind: 'data' },
    { id: 'gold-workers', from: 'gold', to: 'workers', kind: 'async' },
    { id: 'workers-data', from: 'workers', to: 'data', kind: 'async', bidirectional: true },
    { id: 'api-data', from: 'api', to: 'data', kind: 'request', bidirectional: true },
    { id: 'web-api', from: 'web', to: 'api', kind: 'request', bidirectional: true },
  ],
  flow: {
    title: ['From raw data to a location score', 'Del dato crudo al score de un local'],
    steps: [
      {
        title: ['Sources → Bronze: ingest', 'Fuentes → Bronce: ingresar'],
        description: [
          'Collect external data and preserve its original representation. Bronze is the starting point, before cleaning or calculation.',
          'Ingresar datos externos y conservar su representación original. Bronce es el punto de partida, antes de limpiar o calcular.',
        ],
        nodes: ['sources', 'bronze'],
        edges: ['sources-bronze'],
        inspect: 'bronze',
        example: {
          before: [
            'A provider sends a venue record with its own address and category format.',
            'Un proveedor entrega un local con su formato de dirección y categoría.',
          ],
          after: [
            'The raw record is retained in Bronze for later processing.',
            'El registro crudo queda en Bronce para procesarlo después.',
          ],
        },
      },
      {
        title: ['Bronze → Silver: clean and standardize', 'Bronce → Silver: limpiar y normalizar'],
        description: [
          'Apply data quality rules: validate required fields, normalize formats, identify duplicates and prepare compatible data across sources. Silver changes the quality and consistency of the input.',
          'Aplicar reglas de calidad: validar campos necesarios, normalizar formatos, identificar duplicados y preparar datos compatibles entre fuentes. Silver cambia la calidad y consistencia de la entrada.',
        ],
        nodes: ['bronze', 'silver'],
        edges: ['bronze-silver'],
        inspect: 'silver',
        example: {
          before: [
            'Two records describe the same venue with different address formats and categories.',
            'Dos registros describen el mismo local con distintos formatos de dirección y categoría.',
          ],
          after: [
            'A consistent venue record, with a standardized address and category, ready to combine with other data.',
            'Un registro consistente del local, con dirección y categoría normalizadas, listo para combinar con otros datos.',
          ],
        },
      },
      {
        title: ['Silver → Gold: aggregate and evaluate', 'Silver → Gold: agregar y evaluar'],
        description: [
          'Combine prepared data to build location metrics and analytical evaluations. Gold organizes information for the business: demographics, mobility, competition and points of interest become inputs for scoring.',
          'Combinar datos preparados para construir métricas por ubicación y evaluaciones analíticas. Gold organiza la información para el negocio: demografía, movilidad, competencia y puntos de interés se convierten en entradas para el scoring.',
        ],
        nodes: ['silver', 'gold'],
        edges: ['silver-gold'],
        inspect: 'gold',
        example: {
          before: [
            'Normalized venue, demographic and point-of-interest records.',
            'Registros normalizados de locales, demografía y puntos de interés.',
          ],
          after: [
            'Location-level metrics, such as nearby competitor counts, and consolidated evaluations for scoring.',
            'Métricas por ubicación, como cantidad de competidores cercanos, y evaluaciones consolidadas para scoring.',
          ],
        },
      },
      {
        title: ['Gold → Operational data: publish', 'Gold → Datos operativos: publicar'],
        description: [
          'The scoring worker imports prepared results into the operational database. Gold and the operational store serve different responsibilities; loading results does not create a fourth Medallion layer.',
          'El worker de scoring importa los resultados preparados a la base operativa. Gold y la base operativa tienen responsabilidades distintas: publicar resultados no crea una cuarta capa Medallion.',
        ],
        nodes: ['gold', 'workers', 'data'],
        edges: ['gold-workers', 'workers-data'],
        inspect: 'workers',
        example: {
          before: [
            'Analytical results consolidated in Gold.',
            'Resultados analíticos consolidados en Gold.',
          ],
          after: [
            'Operational scores and components available to the backend.',
            'Scores operativos y sus componentes disponibles para el backend.',
          ],
        },
      },
      {
        title: ['API → Web: consult', 'API → Web: consultar'],
        description: [
          'The backend validates access and reads the available score. The web displays its components and calculation date. This request consumes prepared results; it does not run Bronze → Silver → Gold each time.',
          'El backend valida el acceso y consulta el score disponible. La web muestra sus componentes y fecha de cálculo. Esta consulta consume resultados preparados: no ejecuta Bronce → Silver → Gold cada vez.',
        ],
        nodes: ['data', 'api', 'web'],
        edges: ['api-data', 'web-api'],
        inspect: 'web',
        example: {
          before: ['An authorized user chooses a venue.', 'Un usuario autorizado elige un local.'],
          after: [
            'The web presents the score and its supporting components.',
            'La web presenta el score y los componentes que lo explican.',
          ],
        },
      },
    ],
  },
};
