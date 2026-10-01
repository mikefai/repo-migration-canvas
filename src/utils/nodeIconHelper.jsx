import React from 'react';
import {
  Database,
  Cloud,
  Github,
  GitBranch,
  GitFork,
  Server,
  Cpu,
  Layers,
  Zap,
  HardDrive,
  ShieldCheck,
  ListTodo,
  StickyNote,
  LayoutGrid,
  Container,
  Globe,
  Radio,
  Workflow,
  Box,
} from 'lucide-react';

/**
 * Standard Lucide icon definitions for architecture nodes.
 */
export const ICON_DEFINITIONS = {
  database: {
    id: 'database',
    label: 'Database',
    icon: Database,
    color: 'text-amber-400',
    bg: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Relational, NoSQL, or cache database',
  },
  cloud: {
    id: 'cloud',
    label: 'Cloud / Infra',
    icon: Cloud,
    color: 'text-sky-400',
    bg: 'bg-sky-950/80 border-sky-500/40 text-sky-400',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description: 'Cloud provider, serverless, or cluster',
  },
  github: {
    id: 'github',
    label: 'GitHub',
    icon: Github,
    color: 'text-slate-100',
    bg: 'bg-slate-900/80 border-slate-700/60 text-slate-100',
    badge: 'bg-slate-700/30 text-slate-200 border-slate-600/40',
    description: 'GitHub repository or monorepo',
  },
  git: {
    id: 'git',
    label: 'Git / Upstream',
    icon: GitBranch,
    color: 'text-orange-400',
    bg: 'bg-orange-950/80 border-orange-500/40 text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    description: 'Generic Git repository branch',
  },
  server: {
    id: 'server',
    label: 'Server / API',
    icon: Server,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    description: 'REST API, gRPC, or backend service',
  },
  container: {
    id: 'container',
    label: 'Container / Docker',
    icon: Container,
    color: 'text-blue-400',
    bg: 'bg-blue-950/80 border-blue-500/40 text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Docker container or microservice pod',
  },
  worker: {
    id: 'worker',
    label: 'Worker / Queue',
    icon: Cpu,
    color: 'text-purple-400',
    bg: 'bg-purple-950/80 border-purple-500/40 text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Background worker or message queue',
  },
  cache: {
    id: 'cache',
    label: 'Cache / Redis',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/80 border-yellow-500/40 text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    description: 'In-memory cache or fast key-value store',
  },
  storage: {
    id: 'storage',
    label: 'Storage / S3',
    icon: HardDrive,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Object storage, bucket, or volume',
  },
  security: {
    id: 'security',
    label: 'Auth / Security',
    icon: ShieldCheck,
    color: 'text-teal-400',
    bg: 'bg-teal-950/80 border-teal-500/40 text-teal-400',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    description: 'Authentication, IAM, or gateway security',
  },
  task: {
    id: 'task',
    label: 'Task',
    icon: ListTodo,
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-400',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Migration step or checklist item',
  },
  note: {
    id: 'note',
    label: 'Note',
    icon: StickyNote,
    color: 'text-amber-400',
    bg: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Documentation or architecture guideline',
  },
  zone: {
    id: 'zone',
    label: 'Zone',
    icon: LayoutGrid,
    color: 'text-slate-400',
    bg: 'bg-slate-900/80 border-slate-700/60 text-slate-400',
    badge: 'bg-slate-800/40 text-slate-300 border-slate-700/40',
    description: 'Visual boundary or namespace grouping',
  },
};

/**
 * Intelligent icon resolver that scans explicit icon keys, service types,
 * tech stacks, platforms, and names to assign the most appropriate Lucide icon.
 * @param {string} nodeType - ReactFlow node type ('repoNode', 'serviceNode', etc.)
 * @param {object} nodeData - Node data dictionary
 * @returns {object} Resolved icon definition with icon component, colors, and badge styling
 */
export function resolveNodeIcon(nodeType, nodeData = {}) {
  // 1. Explicit user override
  if (nodeData.icon && ICON_DEFINITIONS[nodeData.icon.toLowerCase()]) {
    return ICON_DEFINITIONS[nodeData.icon.toLowerCase()];
  }

  // 2. Scan text fields for architecture hints
  const serviceTypeStr = (nodeData.serviceType || '').toLowerCase();
  const techStackStr = (nodeData.techStack || '').toLowerCase();
  const platformStr = (nodeData.platform || '').toLowerCase();
  const nameStr = (nodeData.name || nodeData.repo || nodeData.fullName || nodeData.title || '').toLowerCase();
  const descStr = (nodeData.description || '').toLowerCase();
  const tagsStr = Array.isArray(nodeData.tags) ? nodeData.tags.join(' ').toLowerCase() : '';
  const combined = `${serviceTypeStr} ${techStackStr} ${platformStr} ${nameStr} ${descStr} ${tagsStr}`;

  // Database detection
  if (
    serviceTypeStr === 'database' ||
    combined.includes('database') ||
    combined.includes('postgres') ||
    combined.includes('mysql') ||
    combined.includes('mongodb') ||
    combined.includes('sqlite') ||
    combined.includes('supabase') ||
    combined.includes('neon') ||
    combined.includes('sql') ||
    combined.includes('drizzle') ||
    combined.includes('prisma') ||
    nameStr.endsWith('-db') ||
    nameStr.includes('database')
  ) {
    return ICON_DEFINITIONS.database;
  }

  // Cloud & Infrastructure detection
  if (
    serviceTypeStr.includes('cloud') ||
    combined.includes('cloud') ||
    combined.includes('aws') ||
    combined.includes('gcp') ||
    combined.includes('azure') ||
    combined.includes('kubernetes') ||
    combined.includes('k8s') ||
    combined.includes('lambda') ||
    combined.includes('serverless') ||
    combined.includes('cloudflare') ||
    combined.includes('infra') ||
    combined.includes('terraform')
  ) {
    return ICON_DEFINITIONS.cloud;
  }

  // GitHub detection
  if (
    platformStr === 'github' ||
    combined.includes('github') ||
    (nodeData.url && nodeData.url.includes('github.com'))
  ) {
    return ICON_DEFINITIONS.github;
  }

  // Container / Docker
  if (combined.includes('docker') || combined.includes('container') || combined.includes('pod')) {
    return ICON_DEFINITIONS.container;
  }

  // Cache / Redis
  if (combined.includes('cache') || combined.includes('redis') || combined.includes('memcached')) {
    return ICON_DEFINITIONS.cache;
  }

  // Storage / Bucket
  if (
    combined.includes('storage') ||
    combined.includes('s3') ||
    combined.includes('bucket') ||
    combined.includes('blob')
  ) {
    return ICON_DEFINITIONS.storage;
  }

  // Worker / Message Queue
  if (
    serviceTypeStr.includes('worker') ||
    serviceTypeStr.includes('queue') ||
    combined.includes('worker') ||
    combined.includes('queue') ||
    combined.includes('kafka') ||
    combined.includes('rabbitmq') ||
    combined.includes('pubsub') ||
    combined.includes('sqs')
  ) {
    return ICON_DEFINITIONS.worker;
  }

  // Security / Auth
  if (
    combined.includes('auth') ||
    combined.includes('security') ||
    combined.includes('oauth') ||
    combined.includes('jwt') ||
    combined.includes('cognito')
  ) {
    return ICON_DEFINITIONS.security;
  }

  // Fallback by ReactFlow node.type
  if (nodeType === 'repoNode') {
    return ICON_DEFINITIONS.github;
  }
  if (nodeType === 'serviceNode') {
    return ICON_DEFINITIONS.server;
  }
  if (nodeType === 'taskNode') {
    return ICON_DEFINITIONS.task;
  }
  if (nodeType === 'noteNode') {
    return ICON_DEFINITIONS.note;
  }
  if (nodeType === 'zoneNode') {
    return ICON_DEFINITIONS.zone;
  }

  return ICON_DEFINITIONS.server;
}
