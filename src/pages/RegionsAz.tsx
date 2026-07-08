import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Code2,
  CirclePlus,
  Globe2,
  Pencil,
  Plus,
  RefreshCcw,
  Settings,
} from 'lucide-react';

type ZoneStatus = 'active' | 'maintenance' | 'offline';
type RegionTone = 'blue' | 'rose';

type ZoneRow = {
  id: string;
  status: ZoneStatus;
  hostCount: number;
  totalCpu: string;
  cpuUsedPercent: number;
  totalMemory: string;
  memoryUsedPercent: number;
};

type RegionBlock = {
  id: string;
  nameKey:
    | 'regionsAz.regions.usEastVirginia'
    | 'regionsAz.regions.chinaSouthGuangzhou'
    | 'regionsAz.regions.euWestIreland';
  code: string;
  tone: RegionTone;
  totalHosts: number;
  totalVcpus: string;
  totalRamTb: number;
  defaultExpanded?: boolean;
  zones: ZoneRow[];
};

const REGION_BLOCKS: RegionBlock[] = [
  {
    id: 'us-east-1',
    nameKey: 'regionsAz.regions.usEastVirginia',
    code: 'us-east-1',
    tone: 'blue',
    totalHosts: 248,
    totalVcpus: '12.5k',
    totalRamTb: 48,
    defaultExpanded: true,
    zones: [
      {
        id: 'us-east-1a',
        status: 'active',
        hostCount: 86,
        totalCpu: '4,200 vCPUs',
        cpuUsedPercent: 75,
        totalMemory: '16 TB',
        memoryUsedPercent: 60,
      },
      {
        id: 'us-east-1b',
        status: 'active',
        hostCount: 92,
        totalCpu: '4,800 vCPUs',
        cpuUsedPercent: 82,
        totalMemory: '18 TB',
        memoryUsedPercent: 45,
      },
      {
        id: 'us-east-1c',
        status: 'maintenance',
        hostCount: 70,
        totalCpu: '3,500 vCPUs',
        cpuUsedPercent: 10,
        totalMemory: '14 TB',
        memoryUsedPercent: 12,
      },
    ],
  },
  {
    id: 'cn-south-1',
    nameKey: 'regionsAz.regions.chinaSouthGuangzhou',
    code: 'cn-south-1',
    tone: 'rose',
    totalHosts: 120,
    totalVcpus: '8.2k',
    totalRamTb: 32,
    defaultExpanded: true,
    zones: [
      {
        id: 'cn-south-1a',
        status: 'active',
        hostCount: 60,
        totalCpu: '4,100 vCPUs',
        cpuUsedPercent: 55,
        totalMemory: '16 TB',
        memoryUsedPercent: 40,
      },
      {
        id: 'cn-south-1b',
        status: 'active',
        hostCount: 60,
        totalCpu: '4,100 vCPUs',
        cpuUsedPercent: 30,
        totalMemory: '16 TB',
        memoryUsedPercent: 25,
      },
    ],
  },
  {
    id: 'eu-west-1',
    nameKey: 'regionsAz.regions.euWestIreland',
    code: 'eu-west-1',
    tone: 'blue',
    totalHosts: 150,
    totalVcpus: '9.6k',
    totalRamTb: 36,
    zones: [
      {
        id: 'eu-west-1a',
        status: 'active',
        hostCount: 78,
        totalCpu: '4,900 vCPUs',
        cpuUsedPercent: 68,
        totalMemory: '18 TB',
        memoryUsedPercent: 44,
      },
      {
        id: 'eu-west-1b',
        status: 'active',
        hostCount: 72,
        totalCpu: '4,700 vCPUs',
        cpuUsedPercent: 52,
        totalMemory: '18 TB',
        memoryUsedPercent: 34,
      },
    ],
  },
];

const STATUS_CLASS: Record<ZoneStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  maintenance: 'bg-amber-100 text-amber-700',
  offline: 'bg-rose-100 text-rose-700',
};

const ZONE_DOT_CLASS: Record<ZoneStatus, string> = {
  active: 'bg-blue-500',
  maintenance: 'bg-amber-500',
  offline: 'bg-rose-500',
};

const CPU_BAR_CLASS: Record<ZoneStatus, string> = {
  active: 'bg-blue-500',
  maintenance: 'bg-amber-500',
  offline: 'bg-rose-500',
};

const REGION_TONE_CLASS: Record<RegionTone, string> = {
  blue: 'bg-blue-100 text-blue-600',
  rose: 'bg-rose-100 text-rose-600',
};

function UsageBar({
  total,
  usedPercent,
  barClassName,
  usedText,
}: {
  total: string;
  usedPercent: number;
  barClassName: string;
  usedText: string;
}) {
  return (
    <div className="min-w-[120px]">
      <div className="text-sm font-semibold leading-none">{total}</div>
      <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', barClassName)} style={{ width: `${usedPercent}%` }} />
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">{usedText}</div>
    </div>
  );
}

export default function RegionsAz() {
  const { t } = useTranslation();
  const [expandedRegions, setExpandedRegions] = useState<string[]>(
    REGION_BLOCKS.filter((region) => region.defaultExpanded).map((region) => region.id)
  );

  const toggleRegion = (regionId: string) => {
    setExpandedRegions((prev) =>
      prev.includes(regionId) ? prev.filter((id) => id !== regionId) : [...prev, regionId]
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('regionsAz.title')}</h2>
          <p className="text-muted-foreground">{t('regionsAz.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t('regionsAz.actions.refresh')}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('regionsAz.actions.addRegion')}
          </Button>
        </div>
      </div>

      {REGION_BLOCKS.map((region) => {
        const isExpanded = expandedRegions.includes(region.id);
        const activeZoneCount = region.zones.filter((zone) => zone.status === 'active').length;

        return (
          <Card key={region.id} className="overflow-hidden border-border/90">
            <div className={cn('px-4 py-3.5', isExpanded && 'border-b')}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-full',
                      REGION_TONE_CLASS[region.tone]
                    )}
                  >
                    <Globe2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-semibold leading-tight tracking-tight">{t(region.nameKey)}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Code2 className="h-3 w-3" />
                      <span className="font-medium">{region.code}</span>
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      <span>{t('regionsAz.region.zonesActive', { count: activeZoneCount })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-end gap-1.5">
                  <div className="text-right">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('regionsAz.region.totalResources')}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-semibold tabular-nums">{region.totalHosts}</span>
                        <span>{t('regionsAz.region.hosts')}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="font-semibold tabular-nums">{region.totalVcpus}</span>
                        <span>{t('regionsAz.region.vcpus')}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="font-semibold tabular-nums">{region.totalRamTb}</span>
                        <span>{t('regionsAz.region.tbRam')}</span>
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/90" aria-label={t('regionsAz.actions.manage')}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground/90"
                    onClick={() => toggleRegion(region.id)}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${t(region.nameKey)}`}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {isExpanded && (
              <>
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="h-11 bg-muted/20 hover:bg-muted/20">
                        <TableHead className="w-[23%] pl-5 text-xs uppercase tracking-wide text-muted-foreground">
                          {t('regionsAz.table.azId')}
                        </TableHead>
                        <TableHead className="w-[20%] text-xs uppercase tracking-wide text-muted-foreground">
                          {t('regionsAz.table.status')}
                        </TableHead>
                        <TableHead className="w-[17%] text-xs uppercase tracking-wide text-muted-foreground">
                          {t('regionsAz.table.hostCount')}
                        </TableHead>
                        <TableHead className="w-[14%] text-xs uppercase tracking-wide text-muted-foreground">
                          {t('regionsAz.table.totalCpu')}
                        </TableHead>
                        <TableHead className="w-[14%] text-xs uppercase tracking-wide text-muted-foreground">
                          {t('regionsAz.table.totalMemory')}
                        </TableHead>
                        <TableHead className="w-[12%] pr-5 text-right text-xs uppercase tracking-wide text-muted-foreground">
                          {t('regionsAz.table.actions')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {region.zones.map((zone) => (
                        <TableRow key={zone.id} className="h-[64px]">
                          <TableCell className="pl-5">
                            <div className="flex items-center gap-2">
                              <span className={cn('h-2 w-2 rounded-full', ZONE_DOT_CLASS[zone.status])} />
                              <span className="font-medium">{zone.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                                STATUS_CLASS[zone.status]
                              )}
                            >
                              {t(`regionsAz.status.${zone.status}`)}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {zone.hostCount} {t('regionsAz.region.hosts')}
                          </TableCell>
                          <TableCell>
                            <UsageBar
                              total={zone.totalCpu}
                              usedPercent={zone.cpuUsedPercent}
                              barClassName={CPU_BAR_CLASS[zone.status]}
                              usedText={t('regionsAz.region.used', { count: zone.cpuUsedPercent })}
                            />
                          </TableCell>
                          <TableCell>
                            <UsageBar
                              total={zone.totalMemory}
                              usedPercent={zone.memoryUsedPercent}
                              barClassName="bg-violet-500"
                              usedText={t('regionsAz.region.used', { count: zone.memoryUsedPercent })}
                            />
                          </TableCell>
                          <TableCell className="pr-5">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-primary hover:text-primary"
                              >
                                {t('regionsAz.actions.manage')}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label={t('regionsAz.table.actions')}>
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-center border-t bg-muted/35 py-2">
                  <Button variant="ghost" className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                    <CirclePlus className="h-4 w-4" />
                    {t('regionsAz.actions.addAvailabilityZone')}
                  </Button>
                </div>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
