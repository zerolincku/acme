import { useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { cn } from '@/lib/utils';
import { useDataTable } from '@/hooks/use-data-table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  Server,
  XCircle,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';

type HostStatus = 'Online' | 'Maintenance' | 'Offline';
type KvmStatus = 'Healthy' | 'Warning' | 'Down';

type Host = {
  id: number;
  hostname: string;
  location: string;
  region: string;
  zone: string;
  ipAddress: string;
  status: HostStatus;
  cpuUsage: number | null;
  memoryUsage: number | null;
  memoryText: string;
  storageUsage: number | null;
  storageText: string;
  kvmStatus: KvmStatus;
};

const MOCK_HOSTS: Host[] = [
  {
    id: 1,
    hostname: 'host-sfo-01',
    location: 'US West (San Francisco)',
    region: 'us-west',
    zone: 'us-west-1a',
    ipAddress: '192.168.10.12',
    status: 'Online',
    cpuUsage: 45,
    memoryUsage: 62,
    memoryText: '32GB / 64GB',
    storageUsage: 28,
    storageText: '1.2TB free',
    kvmStatus: 'Healthy',
  },
  {
    id: 2,
    hostname: 'host-nyc-04',
    location: 'US East (New York)',
    region: 'us-east',
    zone: 'us-east-1b',
    ipAddress: '10.0.4.155',
    status: 'Maintenance',
    cpuUsage: 5,
    memoryUsage: 12,
    memoryText: '16GB / 128GB',
    storageUsage: 90,
    storageText: '10GB free (Low)',
    kvmStatus: 'Warning',
  },
  {
    id: 3,
    hostname: 'host-lon-02',
    location: 'EU West (London)',
    region: 'eu-west',
    zone: 'eu-west-2a',
    ipAddress: '172.16.20.55',
    status: 'Offline',
    cpuUsage: null,
    memoryUsage: null,
    memoryText: 'Unknown',
    storageUsage: null,
    storageText: 'Unknown',
    kvmStatus: 'Down',
  },
  {
    id: 4,
    hostname: 'host-sfo-02',
    location: 'US West (San Francisco)',
    region: 'us-west',
    zone: 'us-west-1a',
    ipAddress: '192.168.10.13',
    status: 'Online',
    cpuUsage: 82,
    memoryUsage: 78,
    memoryText: '50GB / 64GB',
    storageUsage: 41,
    storageText: '800GB free',
    kvmStatus: 'Healthy',
  },
  {
    id: 5,
    hostname: 'host-sfo-03',
    location: 'US West (San Francisco)',
    region: 'us-west',
    zone: 'us-west-1b',
    ipAddress: '192.168.10.14',
    status: 'Online',
    cpuUsage: 12,
    memoryUsage: 35,
    memoryText: '22GB / 64GB',
    storageUsage: 65,
    storageText: '450GB free',
    kvmStatus: 'Healthy',
  },
  {
    id: 6,
    hostname: 'host-fra-01',
    location: 'EU Central (Frankfurt)',
    region: 'eu-central',
    zone: 'eu-central-1a',
    ipAddress: '172.18.1.42',
    status: 'Online',
    cpuUsage: 56,
    memoryUsage: 44,
    memoryText: '28GB / 64GB',
    storageUsage: 36,
    storageText: '920GB free',
    kvmStatus: 'Healthy',
  },
  {
    id: 7,
    hostname: 'host-sin-03',
    location: 'AP Southeast (Singapore)',
    region: 'ap-southeast',
    zone: 'ap-southeast-1a',
    ipAddress: '10.2.31.77',
    status: 'Maintenance',
    cpuUsage: 21,
    memoryUsage: 48,
    memoryText: '31GB / 64GB',
    storageUsage: 73,
    storageText: '280GB free',
    kvmStatus: 'Warning',
  },
  {
    id: 8,
    hostname: 'host-nyc-07',
    location: 'US East (New York)',
    region: 'us-east',
    zone: 'us-east-1a',
    ipAddress: '10.0.9.101',
    status: 'Offline',
    cpuUsage: null,
    memoryUsage: null,
    memoryText: 'Unknown',
    storageUsage: null,
    storageText: 'Unknown',
    kvmStatus: 'Down',
  },
];

const HOST_REGION_OPTIONS = Array.from(new Set(MOCK_HOSTS.map((host) => host.region)));
const HOST_ZONE_OPTIONS = Array.from(new Set(MOCK_HOSTS.map((host) => host.zone)));

function computeStats(hosts: Host[]) {
  return hosts.reduce(
    (stats, host) => {
      if (host.status === 'Online') {
        stats.online += 1;
      } else if (host.status === 'Maintenance') {
        stats.maintenance += 1;
      } else if (host.status === 'Offline') {
        stats.offline += 1;
      }
      return stats;
    },
    { online: 0, maintenance: 0, offline: 0 },
  );
}

function UsageCell({
  value,
  colorClass,
  subText,
  unknownText,
}: {
  value: number | null;
  colorClass: string;
  subText: string;
  unknownText: string;
}) {
  if (value === null) {
    return (
      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted-foreground">--</div>
        <div className="h-1.5 w-16 rounded-full bg-muted" />
        <div className="text-[11px] text-muted-foreground">{unknownText}</div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-foreground">{value}%</div>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', colorClass)} style={{ width: `${value}%` }} />
      </div>
      <div className="text-[11px] text-muted-foreground">{subText}</div>
    </div>
  );
}

function KvmStatusIcon({ status }: { status: KvmStatus }) {
  if (status === 'Healthy') {
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  }
  if (status === 'Warning') {
    return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
  return <XCircle className="h-4 w-4 text-red-500" />;
}

export default function Hosts() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 180);
  const [regionFilter, setRegionFilter] = useState<string | undefined>(undefined);
  const [zoneFilter, setZoneFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<HostStatus | undefined>(undefined);

  const { data: hosts = [], loading, error, refetch } = useFetchData(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return MOCK_HOSTS;
  });

  const normalizedSearch = debouncedSearchTerm.trim().toLowerCase();
  const filteredHosts = hosts.filter((host) => {
    const matchSearch =
      !normalizedSearch ||
      host.hostname.toLowerCase().includes(normalizedSearch) ||
      host.ipAddress.includes(normalizedSearch);
    const matchRegion = !regionFilter || host.region === regionFilter;
    const matchZone = !zoneFilter || host.zone === zoneFilter;
    const matchStatus = !statusFilter || host.status === statusFilter;

    return matchSearch && matchRegion && matchZone && matchStatus;
  });

  const table = useDataTable({
    rows: filteredHosts,
    initialPageSize: 5,
    pageSizeOptions: [5],
    maxVisiblePages: 7,
  });

  const statusStats = useMemo(() => computeStats(hosts), [hosts]);

  const clearFilters = () => {
    setSearchTerm('');
    setRegionFilter(undefined);
    setZoneFilter(undefined);
    setStatusFilter(undefined);
    table.resetPage();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('hosts.title')}</h2>
          <p className="text-muted-foreground">{t('hosts.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('hosts.actions.export')}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('hosts.actions.addHost')}
          </Button>
        </div>
      </div>

      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{t('hosts.filter.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  table.resetPage();
                }}
                placeholder={t('hosts.filter.searchPlaceholder')}
                className="pl-9"
              />
            </div>

            <Select
              value={regionFilter || "all"}
              onValueChange={(value: string) => {
                setRegionFilter(value === "all" ? undefined : value);
                table.resetPage();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('hosts.filter.allRegions')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('hosts.filter.allRegions')}</SelectItem>
                {HOST_REGION_OPTIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={zoneFilter || "all"}
              onValueChange={(value: string) => {
                setZoneFilter(value === "all" ? undefined : value);
                table.resetPage();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('hosts.filter.allZones')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('hosts.filter.allZones')}</SelectItem>
                {HOST_ZONE_OPTIONS.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter || "all"}
              onValueChange={(value: string) => {
                setStatusFilter(value === "all" ? undefined : value as HostStatus);
                table.resetPage();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('hosts.filter.allStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">{t('hosts.status.online')}</SelectItem>
                <SelectItem value="Maintenance">{t('hosts.status.maintenance')}</SelectItem>
                <SelectItem value="Offline">{t('hosts.status.offline')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 border-t pt-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span>
                {t('hosts.filter.summary', {
                  shown: table.totalItems,
                  total: hosts.length,
                })}
              </span>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={clearFilters}
              >
                {t('hosts.filter.clearAllFilters')}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {t('hosts.filter.counts.online', { count: statusStats.online })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {t('hosts.filter.counts.maintenance', { count: statusStats.maintenance })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {t('hosts.filter.counts.offline', { count: statusStats.offline })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>{t('hosts.table.hostname')}</TableHead>
              <TableHead>{t('hosts.table.ipAddress')}</TableHead>
              <TableHead>{t('hosts.table.status')}</TableHead>
              <TableHead>{t('hosts.table.cpuUsage')}</TableHead>
              <TableHead>{t('hosts.table.memory')}</TableHead>
              <TableHead>{t('hosts.table.storage')}</TableHead>
              <TableHead>{t('hosts.table.kvm')}</TableHead>
              <TableHead className="text-right">{t('hosts.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <TableSkeleton rows={5} columns={8} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-destructive">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-6 w-6" />
                    <span>{error.message || t('common.error')}</span>
                    <Button variant="outline" size="sm" onClick={refetch}>
                      {t('common.actions.retry', { defaultValue: 'Retry' })}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.pagedRows.length > 0 ? (
              table.pagedRows.map((host) => {
              const cpuColor = (host.cpuUsage ?? 0) >= 80 ? 'bg-amber-500' : 'bg-blue-500';
              const storageColor =
                host.storageUsage === null
                  ? 'bg-muted'
                  : host.storageUsage >= 85
                    ? 'bg-red-500'
                    : host.storageUsage >= 70
                      ? 'bg-amber-500'
                      : 'bg-cyan-500';

              return (
                <TableRow key={host.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <Server className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Link
                          to={`/infrastructure/hosts/${encodeURIComponent(host.hostname)}`}
                          className="font-semibold transition-colors hover:text-primary"
                        >
                          {host.hostname}
                        </Link>
                        <div className="text-xs text-muted-foreground">{host.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{host.ipAddress}</TableCell>
                  <TableCell>
                    <StatusBadge status={host.status} label={
                      host.status === 'Online' ? t('hosts.status.online')
                      : host.status === 'Maintenance' ? t('hosts.status.maintenance')
                      : t('hosts.status.offline')
                    } />
                  </TableCell>
                  <TableCell>
                    <UsageCell
                      value={host.cpuUsage}
                      colorClass={cpuColor}
                      subText=""
                      unknownText={t('hosts.table.unknown')}
                    />
                  </TableCell>
                  <TableCell>
                    <UsageCell
                      value={host.memoryUsage}
                      colorClass="bg-purple-500"
                      subText={host.memoryText}
                      unknownText={t('hosts.table.unknown')}
                    />
                  </TableCell>
                  <TableCell>
                    <UsageCell
                      value={host.storageUsage}
                      colorClass={storageColor}
                      subText={host.storageText}
                      unknownText={t('hosts.table.unknown')}
                    />
                  </TableCell>
                  <TableCell>
                    <KvmStatusIcon status={host.kvmStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label={t('hosts.table.actions')}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyState title={t('hosts.empty')} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <CardFooter className="flex flex-col gap-3 border-t bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {t('hosts.pagination.showing', {
              start: table.startItem,
              end: table.endItem,
              total: table.totalItems,
            })}
          </div>
          <DataTablePagination table={table} className="mx-0 w-auto justify-end" />
        </CardFooter>
      </Card>
    </div>
  );
}
