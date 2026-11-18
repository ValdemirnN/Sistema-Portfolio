/**
 * TODO O CONTEÚDO DO SITE ESTÁ NESTE ARQUIVO.
 * Para trocar textos, links, projetos ou contatos, edite apenas aqui.
 * Fonte dos dados: currículo de Valdemir Nunes Nicácio.
 */

export const PROFILE = {
  name: 'Valdemir Nunes',
  fullName: 'Valdemir Nunes Nicácio',
  role: 'Analista de Dados & Desenvolvedor de Sistemas',
  city: 'Assu/RN',
  email: 'nvaldemir76@gmail.com',
  phoneDisplay: '(84) 99607-1347',
  whatsapp: '5584996071347',
  linkedin: 'https://linkedin.com/in/valdemir-nunes-2b35a01a3',
  github: 'https://github.com/ValdemirnN',
  photoHero: '/assets/foto-hero.jpg',
  photoAbout: '/assets/foto-sobre.jpg',
};

export const HERO = {
  eyebrow: 'Análise de Dados · Business Intelligence · Sistemas Web e Mobile',
  title: 'Transformo planilhas e processos manuais em dashboards e sistemas que funcionam.',
  text:
    'Sou Valdemir Nunes, bacharel em Sistemas de Informação. Crio dashboards em Power BI, automações e plataformas web e mobile sob medida para empresas que querem decidir com dados e parar de perder tempo com tarefas repetitivas.',
  captionTitle: 'Analista de Dados & Desenvolvedor de Sistemas',
  captionSub: 'Power BI · SQL · React · Flutter · Supabase',
};

export const METRICS = [
  {
    value: '3',
    label: 'Sistemas próprios no ar',
    context: 'Fisiopulso, Luz & Letras e Ritmo Fit, em produção',
  },
  {
    value: '2',
    label: 'Apps internos criados',
    context: 'Consulta+ e MealCheck, usados na operação de uma obra',
  },
  {
    value: '2021',
    label: 'Atuando em TI e dados',
    context: 'Do suporte técnico ao desenvolvimento de sistemas',
  },
  {
    value: 'BI',
    label: 'Dashboards e automações',
    context: 'Power BI, Power Query, Excel/VBA e SQL no dia a dia',
  },
];

export const ABOUT = {
  title: 'Quem sou eu',
  paragraphs: [
    'Sou analista de dados e desenvolvedor de sistemas, formado em Sistemas de Informação pela UFERSA (Angicos/RN). Trabalho com análise de dados, Business Intelligence, automação de processos e desenvolvimento de soluções web e mobile.',
    'Meu foco é otimizar processos, aumentar a eficiência operacional e dar suporte à tomada de decisões. Além do trabalho em empresas, desenvolvo plataformas SaaS próprias, já em produção, para gestão empresarial e atendimento clínico.',
  ],
  facts: [
    { label: 'Formação', value: 'Bacharelado em Sistemas de Informação, UFERSA – Angicos/RN (concluído em 19/12/2024)' },
    { label: 'Certificação', value: 'Dart com Flutter, Academia do Flutter (em andamento)' },
    { label: 'Atualmente', value: 'Auxiliar Técnico na Consolis – Soluções Inteligentes' },
    { label: 'Localização', value: 'Assu/RN, atendendo clientes remotamente' },
  ],
};

export interface Service {
  title: string;
  description: string;
  example: string;
  tags: string[];
}

export const SERVICES_INTRO = {
  title: 'O que eu faço e o que posso fazer pela sua empresa',
  text: 'Cada serviço abaixo vem da minha experiência real. Em cada um, deixei um exemplo do que já entreguei.',
};

export const SERVICES: Service[] = [
  {
    title: 'Dashboards e Business Intelligence',
    description:
      'Reúno seus dados dispersos e transformo em painéis claros de indicadores, produtividade, faturamento e acompanhamento de documentos.',
    example:
      'Dashboards em Power BI para indicadores, produtividade e faturamento (Consolis) e para rastreabilidade documental (Consórcio Sol de Assu).',
    tags: ['Power BI', 'Power Query', 'Excel avançado'],
  },
  {
    title: 'Automação de processos',
    description:
      'Elimino tarefas manuais e repetitivas: conferências, consolidação de planilhas, leitura de PDFs e rotinas de relatório.',
    example:
      'Auditoria e conciliação de dados entre SAP e SOLI-OS e processamento automatizado de PDFs para conferência de informações operacionais e de RH.',
    tags: ['Python', 'VBA', 'Power Query'],
  },
  {
    title: 'Sistemas web sob medida',
    description:
      'Desenvolvo sistemas web para gestão do seu negócio: cadastros, agenda, financeiro, orçamentos, recibos e painéis, com login e dados separados por empresa.',
    example:
      'Fisiopulso (gestão de clínicas) e Luz & Letras (gestão de locadoras de eventos), ambos SaaS em produção.',
    tags: ['React', 'TypeScript', 'Streamlit', 'Supabase'],
  },
  {
    title: 'Aplicativos mobile',
    description:
      'Crio aplicativos para celular e web para consulta de informações, controle de acesso e gestão do dia a dia da operação.',
    example:
      'Consulta+ (consulta de projetos e gestão de treinamentos), MealCheck (controle de acesso ao refeitório) e Ritmo Fit (app Flutter para Android, iOS e web).',
    tags: ['Flutter', 'Dart', 'Kodular'],
  },
  {
    title: 'Banco de dados e organização de dados',
    description:
      'Modelo e organizo seus dados em banco SQL, com tratamento, validação e controle de acesso por perfil de usuário.',
    example:
      'Bancos PostgreSQL no Supabase com Row-Level Security, isolando os dados de cada empresa nos meus SaaS.',
    tags: ['SQL', 'PostgreSQL', 'RLS'],
  },
  {
    title: 'Integrações e automação na nuvem',
    description:
      'Conecto seu sistema a serviços que você já usa e automatizo rotinas como lembretes, agendas e cobranças.',
    example:
      'Integrações com Google Calendar, Google Maps e Mercado Pago no Luz & Letras; lembretes automatizados na agenda do Fisiopulso.',
    tags: ['APIs', 'Serverless', 'GitHub Actions'],
  },
];

export interface SystemProject {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  stack: string[];
  liveUrl: string;
  liveLabel: string;
}

export const SYSTEMS_INTRO = {
  title: 'Sistemas que eu desenvolvi e que estão no ar',
  text: 'São produtos reais, criados por mim do zero. Veja as telas de cada um e abra o sistema para vê-lo funcionando.',
};

export const SYSTEMS: SystemProject[] = [
  {
    id: 'fisiopulso',
    name: 'Fisiopulso',
    category: 'SaaS · Saúde',
    tagline: 'Gestão para clínicas de fisioterapia',
    description:
      'Plataforma para clínicas de fisioterapia, com gestão de pacientes, prontuários, agenda, lembretes, controle financeiro e assinaturas.',
    features: [
      'Pacientes e prontuários SOAP',
      'Agenda integrada com lembretes automatizados',
      'Controle financeiro e administração de assinaturas',
    ],
    stack: ['React', 'TypeScript', 'Supabase (PostgreSQL + RLS)', 'Vercel Serverless', 'Tailwind CSS', 'Recharts', 'Vitest'],
    liveUrl: 'https://fisio-cloud.vercel.app',
    liveLabel: 'Abrir Fisiopulso',
  },
  {
    id: 'luz-letras',
    name: 'Luz & Letras',
    category: 'SaaS · Eventos',
    tagline: 'Gestão para locadoras de materiais para eventos',
    description:
      'Plataforma para empresas de locação de materiais para eventos, com estoque, agendamentos, orçamentos, recibos em PDF e fluxo de caixa.',
    features: [
      'Controle de estoque e agenda de locações',
      'Orçamentos e recibos em PDF',
      'Fluxo de caixa e integrações com Google Calendar, Google Maps e Mercado Pago',
    ],
    stack: ['Python', 'Streamlit', 'Supabase (PostgreSQL)', 'Pandas', 'Plotly', 'GitHub Actions'],
    liveUrl: 'https://luzeletras.streamlit.app',
    liveLabel: 'Abrir Luz & Letras',
  },
  {
    id: 'ritmo-fit',
    name: 'Ritmo Fit',
    category: 'App · Treinos',
    tagline: 'App de gestão de treinos para celular e web',
    description:
      'Aplicativo multiplataforma feito em Flutter, com o mesmo código rodando em Android, iOS e web, conectado a um banco de dados central.',
    features: [
      'Um único código para Android, iOS e web',
      'Dados centralizados no Supabase',
      'Versão web publicada na Vercel',
    ],
    stack: ['Flutter', 'Dart', 'Supabase', 'Vercel'],
    liveUrl: 'https://ritmofit-app-br.vercel.app',
    liveLabel: 'Abrir Ritmo Fit',
  },
];

export const INTERNAL_APPS = {
  title: 'Também desenvolvi para empresas',
  items: [
    {
      name: 'Consulta+',
      text: 'Aplicativo para consulta de projetos e gestão de treinamentos, criado no Consórcio Sol de Assu.',
    },
    {
      name: 'MealCheck',
      text: 'Aplicativo de controle de acesso ao refeitório, que otimizou o fluxo de colaboradores e permitiu monitorar o consumo de alimentos.',
    },
  ],
};

export interface Job {
  period: string;
  role: string;
  company: string;
  points: string[];
}

export const EXPERIENCE: Job[] = [
  {
    period: '02/2026 – Atual',
    role: 'Auxiliar Técnico',
    company: 'Consolis – Soluções Inteligentes',
    points: [
      'Desenvolvimento de automações e sistemas internos para otimizar processos e reduzir tarefas manuais.',
      'Dashboards em Power BI e automações com Power Query e VBA para indicadores, produtividade e faturamento.',
      'Auditoria e conciliação de dados entre SAP e SOLI-OS, processamento automatizado de PDFs e conferência de informações operacionais e de RH.',
    ],
  },
  {
    period: '11/2024 – 10/2025',
    role: 'Assistente de Engenharia',
    company: 'Consórcio Sol de Assu',
    points: [
      'Gestão de projetos, alterações de campo, SAPs, As Built, solicitação de materiais e documentação técnica.',
      'Georreferenciamento com QGIS e monitoramento de equipes em campo.',
      'Desenvolvimento do aplicativo Consulta+ e de dashboards em Power BI para rastreabilidade documental.',
    ],
  },
  {
    period: '11/2023 – 11/2024',
    role: 'Auxiliar Administrativo',
    company: 'Consórcio Sol de Assu',
    points: [
      'Distribuição de projetos, atualização de CER e GRD e dashboards em Power BI para acompanhamento de indicadores.',
      'Desenvolvimento do MealCheck, aplicativo de controle de acesso ao refeitório.',
    ],
  },
  {
    period: '08/2021 – 08/2023',
    role: 'Estagiário',
    company: 'Prefeitura Municipal de Assu',
    points: [
      'Manutenção de sistemas, instalação e formatação de computadores e suporte aos laboratórios de informática.',
    ],
  },
];

export const PROCESS_INTRO = {
  title: 'Como eu trabalho com você',
  text: 'Um processo simples, do problema ao sistema funcionando.',
};

export const PROCESS = [
  {
    title: 'Conversa e diagnóstico',
    detail: 'Entendo como sua operação funciona hoje, onde estão as planilhas, os retrabalhos e os gargalos.',
  },
  {
    title: 'Proposta e escopo',
    detail: 'Defino com você o que será entregue, o prazo e o valor, antes de começar.',
  },
  {
    title: 'Desenvolvimento',
    detail: 'Construo o sistema, o dashboard ou a automação, mostrando o andamento para você validar.',
  },
  {
    title: 'Entrega e suporte',
    detail: 'Publico em produção, ensino sua equipe a usar e fico disponível para ajustes.',
  },
];

export const STACK_GROUPS = [
  { title: 'Análise de dados e BI', items: ['Power BI', 'Power Query', 'Excel avançado (macros/VBA)', 'SQL', 'Auditoria e análise de dados'] },
  { title: 'Linguagens', items: ['Python', 'TypeScript / JavaScript', 'Dart', 'C', 'SQL'] },
  { title: 'Desenvolvimento', items: ['React', 'Streamlit', 'Flutter', 'Kodular', 'APIs e funções serverless'] },
  { title: 'Banco de dados e nuvem', items: ['Supabase (PostgreSQL, RLS)', 'Vercel', 'GitHub Actions'] },
  { title: 'Ferramentas e sistemas', items: ['SAP', 'SOLI-OS', 'VS Code', 'GitHub', 'QGIS', 'AutoCAD'] },
  { title: 'Habilidades', items: ['Automação de processos', 'Metodologias ágeis', 'Suporte técnico a usuários'] },
];

export const SERVICE_OPTIONS = [
  'Dashboard / Business Intelligence',
  'Automação de processos',
  'Sistema web sob medida',
  'Aplicativo mobile',
  'Organização de dados / banco de dados',
  'Ainda não sei, quero conversar',
];

export const CONTACT = {
  title: 'Vamos conversar sobre o seu projeto',
  text: 'Conte rapidamente o que você precisa. Ao enviar, a mensagem já abre pronta no seu WhatsApp ou e-mail e eu respondo pessoalmente com a proposta.',
};
