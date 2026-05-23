import { SKILLS } from '../data/portfolio'

const COLOR_MAP = {
  // programming
  python: '#1e88e5', // brighter blue
  typescript: '#1976d2',
  java: '#f57c00',
  elixir: '#a259ff',
  'c#': '#43a047',
  'c++': '#0288d1',
  sql: '#8e24aa', // purple for contrast
  ruby: '#e53935',
  // frameworks
  pytorch: '#ee4c2c',
  'hugging face': '#ffd600',
  react: '#00e5ff',
  'node.js': '#43a047', // more vibrant green
  'spring boot': '#388e3c',
  electron: '#00bcd4',
  'three.js': '#7c4dff',
  kafka: '#ff8c42',
  docker: '#0277bd',
  kubernetes: '#1565c0', // deeper blue
  terraform: '#d500f9', // magenta for contrast
  aws: '#ffb300',
  azure: '#00cfff', // cyan for high contrast
  'azure functions': '#ffea00', // bright yellow
  'azure service bus': '#00e5ff', // electric blue
  redis: '#ff1744', // vivid red
  pydantic: '#00e676',
  adobe: '#ff1744',
  'adobe target': '#ff1744',
  angular: '#d32f2f',
  'angular 8': '#c2185b',
  contentful: '#00bfae', // teal for contrast
  'nodejs': '#43a047',
  docker: '#00b8d4', // brighter blue
  kubernetes: '#304ffe', // strong blue
  sql: '#ab47bc', // lighter purple
  postgresql: '#1976d2', // lighter blue
  liquibase: '#00e5ff', // electric blue
  javascript: '#ffd600', // bright yellow
  ar: '#ff6d00', // orange for AR
  'chart.js': '#ff9100', // orange for contrast
  'mobile development': '#00e676', // green for contrast
  ios: '#00b8d4', // cyan for contrast
  // specialties
  'llm pipelines': '#ff6ec7',
  'document intelligence': '#5ce1ff',
  rag: '#ffd166',
  'event-driven architecture': '#ff8c42',
  'distributed systems': '#a78bfa',
  'api design': '#5ce1ff',
  'system design': '#ff6ec7',
  'ci/cd': '#ff8c42',
  'evaluation & a/b testing': '#4fd1c7',
  'cloud infrastructure': '#7dd3fc',
  'desktop apps': '#5ce1ff',
  'real-time systems': '#fde047',
  openusd: '#4fd1c7',
  'physical simulation': '#86efac',
  omniverse: '#a78bfa',
  tensorflow: '#ff6f00',
  langchain: '#4fd1c7',
  'unreal engine': '#5ce1ff',
  'ml-agents': '#a3aaae',
  'computer vision': '#86efac',
  nlp: '#ffcc4d',
  'deep learning': '#ff6ec7',
  'reinforcement learning': '#fde047',
  'fine-tuning': '#7dd3fc',
  'game dev': '#a78bfa',
  mcp: '#5ce1ff',
  agents: '#4fd1c7',
  'gpu computing': '#76b900',
  // soft
  'technical leadership': '#ffd166',
  mentorship: '#ff6ec7',
  communication: '#5ce1ff',
  'problem solving': '#ffd166',
  'continuous learning': '#7dd3fc',
  teamwork: '#ff8c42',
  ownership: '#ff5a8a',
}

const ALIASES = {
  'applied ml': 'PyTorch', llms: 'LLM Pipelines', ocr: 'Document Intelligence',
  evaluation: 'Evaluation & A/B Testing', cloud: 'Cloud Infrastructure',
  containers: 'Docker', graphql: 'API Design', 'api integration': 'API Design',
  apigee: 'API Design', 'stakeholder communication': 'Communication',
  'high-throughput systems': 'Distributed Systems', microservices: 'Distributed Systems',
  'developer tooling': 'Desktop Apps', frontend: 'React', remix: 'React',
  angular: 'TypeScript', 'angular 8': 'TypeScript', javascript: 'TypeScript',
  'chart.js': 'TypeScript', contentful: 'TypeScript', 'adobe target': 'TypeScript',
  'mobile development': 'TypeScript', android: 'Java', kotlin: 'Java',
  ios: 'C++', ar: 'Three.js', 'auth & identity': 'Spring Boot',
  pydantic: 'Python', postgresql: 'SQL', redis: 'SQL', liquibase: 'SQL',
  datadog: 'Cloud Infrastructure', concourse: 'CI/CD', jenkins: 'CI/CD',
  'github actions': 'CI/CD', 'azure functions': 'Azure',
  'azure service bus': 'Azure', 'aws appsync': 'AWS', 'aws rds': 'AWS', 'aws s3': 'AWS',
  'audio ml': 'Real-Time Systems', 'ml systems': 'LLM Pipelines',
  algorithms: 'System Design', 'data structures': 'System Design',
}

const ALL_SKILLS = Object.values(SKILLS).flat()
const lc = (s) => String(s || '').toLowerCase().trim()

function resolveKey(key) {
  const k = lc(key)
  if (!k) return null
  if (ALL_SKILLS.some((s) => lc(s.key) === k)) return k
  const alias = ALIASES[k]
  return alias ? lc(alias) : null
}

export function findSkill(key) {
  const resolved = resolveKey(key)
  if (!resolved) return null
  return ALL_SKILLS.find((s) => lc(s.key) === resolved) || null
}

export function skillColor(key) {
  const resolved = resolveKey(key) || lc(key)
  return COLOR_MAP[resolved] || '#5ce1ff'
}
