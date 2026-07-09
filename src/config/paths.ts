export const ROUTE_PATHS = {
  DASHBOARD: '/',
  
  INFRASTRUCTURE: '/infrastructure',
  HOST_LIST: '/infrastructure/hosts',
  HOST_DETAIL: '/infrastructure/hosts/:hostname',
  REGIONS_AZS: '/infrastructure/regions-azs',
  VMS: '/infrastructure/vms',
  STORAGE_POOLS: '/infrastructure/storage-pools',
  
  MANAGEMENT: '/management',
  USER_LIST: '/management/users',
  ORG_LIST: '/management/orgs',
  USER_GROUPS: '/management/groups',
  
  SYSTEM: '/system',
  SETTINGS: '/system/settings',
  SECURITY: '/system/security',

  COMPONENTS: '/components',
  PAGE_TEMPLATES: '/page-templates',
  PAGE_TEMPLATE_LIST: '/page-templates/list',
  PAGE_TEMPLATE_DETAIL: '/page-templates/detail',
  PAGE_TEMPLATE_CREATE: '/page-templates/create',
  PAGE_TEMPLATE_SHEET: '/page-templates/sheet',
  PAGE_TEMPLATE_DIALOG: '/page-templates/dialog',
  PAGE_TEMPLATE_STATS: '/page-templates/stats',
} as const;
