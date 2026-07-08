import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Box,
  CheckCircle2,
  Clock3,
  Cpu,
  Database,
  Filter,
  GitCommit,
  HardDrive,
  Layers,
  Monitor,
  Network,
  Plus,
  RefreshCcw,
  Search,
  Server,
  Settings,
} from 'lucide-react';

type DetailTab = 'overview' | 'vmInstances' | 'systemInfo' | 'network' | 'storage';

type VmStatus = 'running' | 'paused' | 'error';

type VmRow = {
  id: string;
  os: string;
  status: VmStatus;
  ip: string;
  cpu: number | null;
  ram: string | null;
};

const VM_ROWS: VmRow[] = [
  {
    id: 'web-prod-01',
    os: 'Ubuntu 22.04 LTS',
    status: 'running',
    ip: '10.0.0.142',
    cpu: 45,
    ram: '2.4 GB',
  },
  {
    id: 'db-redis-cache',
    os: 'Alpine Linux',
    status: 'paused',
    ip: '10.0.0.145',
    cpu: 0,
    ram: '1.1 GB',
  },
  {
    id: 'worker-node-04',
    os: 'Debian 11',
    status: 'running',
    ip: '10.0.0.189',
    cpu: 78,
    ram: '8.0 GB',
  },
  {
    id: 'analytics-pipeline',
    os: 'CentOS 8',
    status: 'error',
    ip: '10.0.0.192',
    cpu: null,
    ram: null,
  },
];

function RingGauge({ percent, color }: { percent: number; color: string }) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      className="relative h-16 w-16 shrink-0 rounded-full ring-1 ring-border/70"
      style={{
        background: `conic-gradient(${color} ${clamped * 3.6}deg, hsl(var(--muted)) 0deg)`,
      }}
    >
      <div className="absolute inset-[5px] rounded-full bg-card" />
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold">{clamped}%</div>
    </div>
  );
}

function VmResourceCell({ cpu, ram }: { cpu: number | null; ram: string | null }) {
  if (cpu === null || ram === null) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">-</div>
        <div className="text-sm text-muted-foreground">-</div>
      </div>
    );
  }

  const cpuColor = cpu >= 75 ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div className="space-y-1.5 min-w-[130px]">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>CPU</span>
        <span>{cpu}%</span>
      </div>
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', cpuColor)} style={{ width: `${cpu}%` }} />
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>RAM</span>
        <span>{ram}</span>
      </div>
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.min(cpu + 10, 100)}%` }} />
      </div>
    </div>
  );
}

export default function HostDetail() {
  const { t } = useTranslation();
  const { hostname = 'host-01.us-east' } = useParams();
  const [activeTab, setActiveTab] = useState<DetailTab>('systemInfo');

  const hostName = decodeURIComponent(hostname);

  const host = {
    name: hostName,
    ip: '192.168.1.105',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    regionLabel: 'NYC Region',
    cpuUsed: 12,
    cpuTotal: 64,
    cpuPercent: 19,
    memoryUsed: 128,
    memoryTotal: 256,
    memoryPercent: 50,
    storageUsed: 4.5,
    storageTotal: 10,
    storagePercent: 45,
    vmTotal: 12,
    vcpuAvailable: 32,
    vcpuTotal: 64,
  };

  const tabItems: Array<{ key: DetailTab; label: string; badge?: string }> = [
    { key: 'overview', label: t('hostDetail.tabs.overview') },
    {
      key: 'vmInstances',
      label: t('hostDetail.tabs.vmInstances'),
      badge: String(host.vmTotal),
    },
    { key: 'systemInfo', label: t('hostDetail.tabs.systemInfo') },
    { key: 'network', label: t('hostDetail.tabs.network') },
    { key: 'storage', label: t('hostDetail.tabs.storage') },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">{host.name}</h1>

            {activeTab === 'vmInstances' ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Server className="h-4 w-4" />
                <span>{t('hostDetail.meta.physicalHost')}</span>
                <span>·</span>
                <span>{host.regionLabel}</span>
                <span>·</span>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {t('hostDetail.status.online')}
                </span>
              </div>
            ) : (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Server className="h-4 w-4" />
                <span className="font-mono">{host.ip}</span>
                <span>•</span>
                <span className="max-w-[420px] truncate font-mono">{t('hostDetail.meta.uuid')}: {host.uuid.slice(0, 16)}...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'vmInstances' ? (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('hostDetail.actions.deployVm')}
              </Button>
            ) : (
              <>
                <Button variant="outline">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {t('hostDetail.actions.sync')}
                </Button>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  • {t('hostDetail.status.online')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <span>{tab.label}</span>
              {tab.badge && <span className="text-xs text-muted-foreground">{tab.badge}</span>}
            </button>
          );
        })}
      </div>

      {activeTab !== 'vmInstances' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-none">
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{t('hostDetail.summary.cpuUsage')}</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {host.cpuUsed} <span className="text-muted-foreground">/ {host.cpuTotal} Cores</span>
                </p>
                <p className="mt-2 text-sm font-medium text-emerald-600">↘ {t('hostDetail.status.lowLoad')}</p>
              </div>
              <RingGauge percent={host.cpuPercent} color="#3b82f6" />
            </div>
          </Card>

          <Card className="shadow-none">
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{t('hostDetail.summary.memoryUsage')}</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {host.memoryUsed} <span className="text-muted-foreground">/ {host.memoryTotal} GB</span>
                </p>
                <p className="mt-2 text-sm font-medium text-amber-600">→ {t('hostDetail.status.stable')}</p>
              </div>
              <RingGauge percent={host.memoryPercent} color="#f59e0b" />
            </div>
          </Card>

          <Card className="shadow-none">
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{t('hostDetail.summary.storageUsage')}</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {host.storageUsed} <span className="text-muted-foreground">/ {host.storageTotal} TB</span>
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {t('hostDetail.status.healthy')}
                </p>
              </div>
              <RingGauge percent={host.storagePercent} color="#10b981" />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'systemInfo' && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="overflow-hidden">
            <div className="border-b px-5 py-4 text-lg font-semibold">
              {t('hostDetail.section.hardwareKernel')}
            </div>

            <div className="grid gap-x-12 gap-y-8 px-5 py-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('hostDetail.fields.cpuModel')}</div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  Intel(R) Xeon(R) Gold 6248R CPU @ 3.00GHz
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('hostDetail.fields.architecture')}</div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  x86_64
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('hostDetail.fields.operatingSystem')}</div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  Ubuntu 22.04.3 LTS (Jammy Jellyfish)
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('hostDetail.fields.kernelVersion')}</div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  5.15.0-91-generic
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('hostDetail.fields.uptime')}</div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock3 className="h-4 w-4 text-muted-foreground" />
                  45 days, 12 hours, 32 minutes
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('hostDetail.fields.virtualization')}</div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  KVM / Libvirt 8.0.0
                </div>
              </div>
            </div>

            <div className="border-t px-5 py-4 text-lg font-semibold">
              {t('hostDetail.section.agentStatus')}
            </div>

            <div className="grid gap-x-12 gap-y-8 px-5 py-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('hostDetail.fields.agentVersion')}</div>
                <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  v2.4.1-stable
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t('hostDetail.fields.gitCommit')}</div>
                <div className="flex items-center gap-2 text-sm font-medium font-mono">
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  a1b2c3d4
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-none">
              <div className="p-4">
                <h3 className="text-xl font-semibold">{t('hostDetail.section.activityLog')}</h3>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-blue-600">↺</div>
                    <div className="flex-1 text-sm text-muted-foreground">{t('hostDetail.activity.heartbeatReceived')}</div>
                    <div className="text-xs text-muted-foreground">2m ago</div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">{t('hostDetail.activity.vmProvisioned')}</div>
                    <div className="text-xs text-muted-foreground">2h ago</div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-amber-100 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">{t('hostDetail.activity.agentUpdated')}</div>
                    <div className="text-xs text-muted-foreground">1d ago</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="shadow-none">
              <div className="p-4">
                <h3 className="text-xl font-semibold">{t('hostDetail.section.troubleshoot')}</h3>
                <div className="mt-4 space-y-2">
                  <button type="button" className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm hover:bg-muted/80">
                    <span>{t('hostDetail.troubleshoot.viewAgentLogs')}</span>
                    <span className="text-muted-foreground">↗</span>
                  </button>
                  <button type="button" className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm hover:bg-muted/80">
                    <span>{t('hostDetail.troubleshoot.remoteConsole')}</span>
                    <span className="text-muted-foreground">↗</span>
                  </button>
                  <button type="button" className="flex w-full items-center justify-between rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100">
                    <span>{t('hostDetail.troubleshoot.maintenanceMode')}</span>
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'vmInstances' && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="shadow-none">
              <div className="flex items-start justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{t('hostDetail.summary.totalInstances')}</p>
                  <p className="mt-3 text-4xl font-semibold">{host.vmTotal}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('hostDetail.summary.activeVirtualMachines')}</p>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-600">
                  <Database className="h-4 w-4" />
                </div>
              </div>
            </Card>

            <Card className="shadow-none">
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{t('hostDetail.summary.vcpuAvailability')}</p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight">
                    {host.vcpuAvailable} <span className="text-muted-foreground">/ {host.vcpuTotal} Cores</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('hostDetail.summary.capacityRemaining', { count: 50, defaultValue: '50% capacity remaining' })}</p>
                </div>
                <RingGauge percent={50} color="#a855f7" />
              </div>
            </Card>

            <Card className="shadow-none">
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{t('hostDetail.summary.memoryAvailability')}</p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight">
                    {host.memoryUsed} <span className="text-muted-foreground">/ {host.memoryTotal} GB</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('hostDetail.summary.capacityRemaining', { count: 50, defaultValue: '50% capacity remaining' })}</p>
                </div>
                <RingGauge percent={50} color="#f97316" />
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('hostDetail.vm.searchPlaceholder')}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {t('hostDetail.actions.filter')}
              </Button>
              <Button variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                {t('hostDetail.actions.refresh')}
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/25">
                  <TableHead>{t('hostDetail.vm.table.vmName')}</TableHead>
                  <TableHead>{t('hostDetail.vm.table.status')}</TableHead>
                  <TableHead>{t('hostDetail.vm.table.internalIp')}</TableHead>
                  <TableHead>{t('hostDetail.vm.table.resourceUsage')}</TableHead>
                  <TableHead className="text-right">{t('hostDetail.vm.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VM_ROWS.map((vm) => (
                  <TableRow key={vm.id} className="h-[76px]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-md bg-blue-50 text-blue-600">
                          <Server className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold">{vm.id}</div>
                          <div className="text-xs text-muted-foreground">{vm.os}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                          vm.status === 'running' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                          vm.status === 'paused' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                          vm.status === 'error' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                        )}
                      >
                        {vm.status === 'running' && t('hostDetail.status.running')}
                        {vm.status === 'paused' && t('hostDetail.status.paused')}
                        {vm.status === 'error' && t('hostDetail.status.error')}
                      </span>
                    </TableCell>

                    <TableCell className="font-mono text-sm">{vm.ip}</TableCell>
                    <TableCell>
                      <VmResourceCell cpu={vm.cpu} ram={vm.ram} />
                    </TableCell>

                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label={t('hostDetail.vm.table.actions')}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t px-5 py-4 text-sm text-muted-foreground">
              <span>{t('hostDetail.vm.showing', { start: 1, end: 4, total: 12, defaultValue: 'Showing 1 to 4 of 12 results' })}</span>
              <div className="flex items-center gap-6">
                <span className="opacity-50">{t('hostDetail.vm.previous')}</span>
                <span className="text-foreground">{t('hostDetail.vm.next')}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'overview' && (
        <Card className="shadow-none">
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-6">{t('hostDetail.overview.description')}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <RingGauge percent={host.cpuPercent} color="#3b82f6" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('hostDetail.summary.cpuUsage')}</p>
                  <p className="text-lg font-semibold">{host.cpuUsed}/{host.cpuTotal} <span className="text-sm font-normal text-muted-foreground">Cores</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <RingGauge percent={host.memoryPercent} color="#f59e0b" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('hostDetail.summary.memoryUsage')}</p>
                  <p className="text-lg font-semibold">{host.memoryUsed}/{host.memoryTotal} <span className="text-sm font-normal text-muted-foreground">GB</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <RingGauge percent={host.storagePercent} color="#10b981" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('hostDetail.summary.storageUsage')}</p>
                  <p className="text-lg font-semibold">{host.storageUsed}/{host.storageTotal} <span className="text-sm font-normal text-muted-foreground">TB</span></p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'network' && (
        <Card className="shadow-none">
          <div className="space-y-2 p-6">
            <p className="text-lg font-semibold">{t('hostDetail.network.title')}</p>
            <p className="text-sm text-muted-foreground">{t('hostDetail.network.description')}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Network className="h-4 w-4" />
              <span>eth0 · 10GbE · 192.168.1.105</span>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'storage' && (
        <Card className="shadow-none">
          <div className="space-y-2 p-6">
            <p className="text-lg font-semibold">{t('hostDetail.storage.title')}</p>
            <p className="text-sm text-muted-foreground">{t('hostDetail.storage.description')}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <HardDrive className="h-4 w-4" />
              <span>nvme0n1 · 3.2TB free · RAID10 healthy</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
