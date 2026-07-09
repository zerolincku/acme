import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CloudCog,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  PanelRightOpen,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { ActionMenu, ActionMenuItem } from '@/components/ActionMenu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { StatusBadge } from '@/components/ui/status-badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TimePicker } from '@/components/ui/time-picker';
import { cn } from '@/lib/utils';

const services = [
  {
    id: 'svc-api-prod',
    name: 'Payment API',
    owner: 'FinOps Platform',
    env: 'production',
    region: 'singapore',
    status: 'healthy',
    risk: 'low',
    spend: '$18,420',
    usage: 72,
    deploy: '2026-07-08 09:16',
    errorBudget: 81,
  },
  {
    id: 'svc-iam-core',
    name: 'Identity Gateway',
    owner: 'Security',
    env: 'production',
    region: 'tokyo',
    status: 'warning',
    risk: 'medium',
    spend: '$9,870',
    usage: 84,
    deploy: '2026-07-07 21:42',
    errorBudget: 63,
  },
  {
    id: 'svc-ml-batch',
    name: 'Batch Inference',
    owner: 'Data Intelligence',
    env: 'staging',
    region: 'virginia',
    status: 'healthy',
    risk: 'low',
    spend: '$6,230',
    usage: 48,
    deploy: '2026-07-06 18:05',
    errorBudget: 92,
  },
  {
    id: 'svc-reporting',
    name: 'Executive Reporting',
    owner: 'Business Apps',
    env: 'production',
    region: 'frankfurt',
    status: 'offline',
    risk: 'high',
    spend: '$4,810',
    usage: 31,
    deploy: '2026-07-05 13:22',
    errorBudget: 34,
  },
];

const statSeries = [44, 58, 52, 67, 74, 69, 82, 77, 88, 91, 86, 94];

const catalogDescriptor = [
  'apiVersion: backstage.io/v1alpha1',
  'kind: Component',
  'metadata:',
  '  name: settlement-worker',
  '  annotations:',
  '    pagerduty.com/service-id: PD7K92',
  '    grafana/dashboard-selector: settlement',
  'spec:',
  '  type: service',
  '  lifecycle: production',
  '  owner: group:finops-platform',
  '  system: payments',
].join('\n');

type ListFilters = {
  query: string;
  environment: string;
  health: string;
  owner: string;
  risk: string;
  region: string;
  minSlo: string;
};

const emptyListFilters: ListFilters = {
  query: '',
  environment: '',
  health: '',
  owner: '',
  risk: '',
  region: '',
  minSlo: '',
};

const ownerFilterMap: Record<string, string> = {
  platform: 'FinOps Platform',
  security: 'Security',
  data: 'Data Intelligence',
};

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 border-b bg-background px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <CloudCog className="h-4 w-4" />
          <span>{t('pageTemplates.kicker')}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" icon={Download}>{t('pageTemplates.actions.export')}</Button>
        <Button icon={Plus}>{t('pageTemplates.actions.create')}</Button>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  children,
  hint,
  reserveHint = false,
}: {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  reserveHint?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label id={`${id}-label`} htmlFor={id}>{label}</Label>
      {children}
      {hint || reserveHint ? (
        <p className={cn('min-h-4 text-xs text-muted-foreground', !hint && 'invisible')} aria-hidden={!hint}>
          {hint || '\u00a0'}
        </p>
      ) : null}
    </div>
  );
}

function DateTimePickerField({ id, labelId }: { id: string; labelId: string }) {
  const { i18n } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(() => new Date('2026-07-12T22:00:00'));
  const [time, setTime] = useState('22:00');
  const dateLabel = date
    ? `${date.toLocaleDateString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US')} ${time}`
    : '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          aria-labelledby={labelId}
          variant="outline"
          className={cn('h-9 w-full justify-start px-3 text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {dateLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <div className="flex justify-center border-t p-3">
          <TimePicker value={time} onChange={setTime} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  trendTone,
}: {
  title: string;
  value: string;
  trend: string;
  icon: typeof Activity;
  trendTone?: 'good' | 'bad';
}) {
  const isGood = trendTone ? trendTone === 'good' : trend.startsWith('+');

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription>{title}</CardDescription>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <div className={cn('mt-1 flex items-center gap-1 text-xs', isGood ? 'text-emerald-600' : 'text-red-600')}>
          {trend.startsWith('+') ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          <span>{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Toolbar({
  filters,
  onFiltersChange,
}: {
  filters: ListFilters;
  onFiltersChange: (filters: ListFilters) => void;
}) {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const setFilter = (key: keyof ListFilters) => (value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };
  const currentFilters = [
    filters.query ? `search:${filters.query}` : '',
    filters.environment ? `env:${t(`pageTemplates.environment.${filters.environment}`)}` : '',
    filters.health ? `health:${t(`pageTemplates.status.${filters.health}`)}` : '',
    filters.owner ? `owner:${t(`pageTemplates.options.${filters.owner}`)}` : '',
    filters.risk ? `risk:${t(`pageTemplates.risk.${filters.risk}`)}` : '',
    filters.region ? `region:${t(`pageTemplates.regions.${filters.region}`)}` : '',
    filters.minSlo ? `slo:>=${filters.minSlo}%` : '',
  ].filter(Boolean);
  const refreshList = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-3 border-b bg-muted/20 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_160px_160px_160px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
	            <Input
	              className="pl-9"
	              value={filters.query}
	              onChange={(event) => setFilter('query')(event.target.value)}
	              placeholder={t('pageTemplates.fields.search')}
	            />
          </div>
          <div>
	            <Select
	              value={filters.environment}
	              onValueChange={setFilter('environment')}
	              clearLabel={t('pageTemplates.actions.clearField', { field: t('pageTemplates.fields.environment') })}
	              clearable
            >
              <SelectTrigger><SelectValue placeholder={t('pageTemplates.fields.environment')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="production">{t('pageTemplates.options.production')}</SelectItem>
                <SelectItem value="staging">{t('pageTemplates.options.staging')}</SelectItem>
                <SelectItem value="sandbox">{t('pageTemplates.options.sandbox')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
	            <Select
	              value={filters.health}
	              onValueChange={setFilter('health')}
	              clearLabel={t('pageTemplates.actions.clearField', { field: t('pageTemplates.fields.health') })}
	              clearable
            >
              <SelectTrigger><SelectValue placeholder={t('pageTemplates.fields.health')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="healthy">{t('pageTemplates.status.healthy')}</SelectItem>
                <SelectItem value="warning">{t('pageTemplates.status.warning')}</SelectItem>
                <SelectItem value="offline">{t('pageTemplates.status.offline')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
	            <Select
	              value={filters.owner}
	              onValueChange={setFilter('owner')}
	              clearLabel={t('pageTemplates.actions.clearField', { field: t('pageTemplates.fields.owner') })}
	              clearable
            >
              <SelectTrigger><SelectValue placeholder={t('pageTemplates.fields.owner')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">{t('pageTemplates.options.platform')}</SelectItem>
                <SelectItem value="security">{t('pageTemplates.options.security')}</SelectItem>
                <SelectItem value="data">{t('pageTemplates.options.data')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={RefreshCw} loading={isRefreshing} onClick={refreshList}>
            {t('common.actions.refresh')}
          </Button>
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            icon={Filter}
            aria-pressed={showFilters}
            onClick={() => setShowFilters((visible) => !visible)}
          >
            {t('pageTemplates.actions.filter')}
          </Button>
          <Button
            variant="outline"
            icon={RotateCcw}
	            disabled={currentFilters.length === 0}
	            onClick={() => onFiltersChange(emptyListFilters)}
	          >
            {t('common.actions.reset')}
          </Button>
        </div>
      </div>
      {showFilters ? (
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-[160px_160px_160px]">
	          <Select
	            value={filters.risk}
	            onValueChange={setFilter('risk')}
	            clearLabel={t('pageTemplates.actions.clearField', { field: t('pageTemplates.fields.risk') })}
	            clearable
          >
            <SelectTrigger><SelectValue placeholder={t('pageTemplates.fields.risk')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{t('pageTemplates.risk.low')}</SelectItem>
              <SelectItem value="medium">{t('pageTemplates.risk.medium')}</SelectItem>
              <SelectItem value="high">{t('pageTemplates.risk.high')}</SelectItem>
            </SelectContent>
          </Select>
	          <Select
	            value={filters.region}
	            onValueChange={setFilter('region')}
	            clearLabel={t('pageTemplates.actions.clearField', { field: t('pageTemplates.fields.region') })}
	            clearable
          >
            <SelectTrigger><SelectValue placeholder={t('pageTemplates.fields.region')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="singapore">{t('pageTemplates.regions.singapore')}</SelectItem>
              <SelectItem value="tokyo">{t('pageTemplates.regions.tokyo')}</SelectItem>
              <SelectItem value="virginia">{t('pageTemplates.regions.virginia')}</SelectItem>
              <SelectItem value="frankfurt">{t('pageTemplates.regions.frankfurt')}</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
	            min="0"
	            max="100"
	            value={filters.minSlo}
	            onChange={(event) => setFilter('minSlo')(event.target.value)}
	            placeholder={t('pageTemplates.fields.minSlo')}
	          />
        </div>
      ) : null}
    </div>
  );
}

function ListTemplate() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ListFilters>(emptyListFilters);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const filteredServices = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const minSlo = Number(filters.minSlo);

    return services.filter((service) => {
      const matchesQuery = !query || [
        service.name,
        service.id,
        service.owner,
        t(`pageTemplates.environment.${service.env}`),
        t(`pageTemplates.status.${service.status}`),
        t(`pageTemplates.regions.${service.region}`),
        t(`pageTemplates.risk.${service.risk}`),
      ].some((value) => value.toLowerCase().includes(query));
      const matchesSlo = !filters.minSlo || (!Number.isNaN(minSlo) && service.errorBudget >= minSlo);

      return (
        matchesQuery
        && (!filters.environment || service.env === filters.environment)
        && (!filters.health || service.status === filters.health)
        && (!filters.owner || service.owner === ownerFilterMap[filters.owner])
        && (!filters.risk || service.risk === filters.risk)
        && (!filters.region || service.region === filters.region)
        && matchesSlo
      );
    });
  }, [filters, t]);
  const selectedVisibleServices = selectedServices.filter((id) => filteredServices.some((service) => service.id === id));
  const allSelected = filteredServices.length > 0 && selectedVisibleServices.length === filteredServices.length;
  const someSelected = selectedVisibleServices.length > 0 && !allSelected;
  const toggleAllServices = () => {
    const visibleIds = filteredServices.map((service) => service.id);
    setSelectedServices((current) => (
      allSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])]
    ));
  };
  const toggleService = (id: string) => {
    setSelectedServices((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard title={t('pageTemplates.metrics.productionServices')} value="128" trend={t('pageTemplates.metrics.trends.services')} icon={CloudCog} />
        <MetricCard title={t('pageTemplates.metrics.monthlyRunCost')} value="$245.8k" trend={t('pageTemplates.metrics.trends.cost')} icon={Database} trendTone="good" />
        <MetricCard title={t('pageTemplates.metrics.openRiskItems')} value="17" trend={t('pageTemplates.metrics.trends.risk')} icon={AlertTriangle} />
      </div>
      <Card className="overflow-hidden shadow-none">
        <Toolbar filters={filters} onFiltersChange={setFilters} />
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  aria-label={t('pageTemplates.list.selectAllServices')}
                  onCheckedChange={toggleAllServices}
                />
              </TableHead>
              <TableHead>{t('pageTemplates.table.service')}</TableHead>
              <TableHead>{t('pageTemplates.table.owner')}</TableHead>
              <TableHead>{t('pageTemplates.table.environment')}</TableHead>
              <TableHead>{t('pageTemplates.table.health')}</TableHead>
              <TableHead>{t('pageTemplates.table.readiness')}</TableHead>
              <TableHead>{t('pageTemplates.table.utilization')}</TableHead>
              <TableHead>{t('pageTemplates.table.monthlyCost')}</TableHead>
              <TableHead className="text-right">{t('pageTemplates.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    aria-label={t('pageTemplates.list.selectService', { name: service.name })}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-xs text-muted-foreground">{service.id} · {t(`pageTemplates.regions.${service.region}`)}</div>
                </TableCell>
                <TableCell>{service.owner}</TableCell>
                <TableCell><Badge variant="outline">{t(`pageTemplates.environment.${service.env}`)}</Badge></TableCell>
                <TableCell><StatusBadge status={service.status} label={t(`pageTemplates.status.${service.status}`)} /></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">{t('pageTemplates.list.riskLabel', { risk: t(`pageTemplates.risk.${service.risk}`) })}</Badge>
                    <Badge variant={service.errorBudget < 50 ? 'destructive' : 'secondary'}>{service.errorBudget}% SLO</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-36 space-y-1">
                    <Progress value={service.usage} variant={service.usage > 80 ? 'warning' : 'default'} />
                    <div className="text-xs text-muted-foreground">{t('pageTemplates.list.averageUsage', { value: service.usage })}</div>
                  </div>
                </TableCell>
                <TableCell>{service.spend}</TableCell>
                <TableCell className="text-right">
                  <ActionMenu ariaLabel={t('pageTemplates.list.rowActions', { name: service.name })}>
                    {() => (
                      <>
                        <ActionMenuItem icon={<Eye className="h-4 w-4" />}>{t('pageTemplates.actions.openDetail')}</ActionMenuItem>
                        <ActionMenuItem icon={<CalendarDays className="h-4 w-4" />}>{t('pageTemplates.actions.planChange')}</ActionMenuItem>
                        <ActionMenuItem icon={<ShieldCheck className="h-4 w-4" />}>{t('pageTemplates.actions.requestReview')}</ActionMenuItem>
                      </>
                    )}
                  </ActionMenu>
	                </TableCell>
	              </TableRow>
	            ))}
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                  {t('pageTemplates.list.noResults')}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function DetailTemplate() {
  const { t } = useTranslation();
  const service = services[0];
  const dependencyRows = [
    ['Checkout Web', t('pageTemplates.detail.relationships.upstream'), '99.99%'],
    ['Payment DB', t('pageTemplates.detail.relationships.criticalDependency'), '99.95%'],
    ['Fraud Scoring', t('pageTemplates.detail.relationships.downstream'), '99.90%'],
  ];
  const runtimeRows = [
    [t('pageTemplates.detail.topology.ingress'), 'api.payments.acme.internal', 'healthy'],
    [t('pageTemplates.detail.topology.service'), 'payment-api', 'healthy'],
    [t('pageTemplates.detail.topology.deployment'), 'payment-api-v42', 'warning'],
    [t('pageTemplates.detail.topology.pods'), t('pageTemplates.detail.topology.podsState'), 'warning'],
    [t('pageTemplates.detail.topology.database'), 'payment-primary', 'healthy'],
  ];
  const auditRows = [
    ['09:48', t('pageTemplates.detail.auditTrail.scalePolicy')],
    ['08:21', t('pageTemplates.detail.auditTrail.pciEvidence')],
    [t('pageTemplates.detail.auditTrail.yesterday'), t('pageTemplates.detail.auditTrail.latencyAlert')],
  ];
  const timeline = [
    { title: t('pageTemplates.detail.activity.scalePolicy'), meta: t('pageTemplates.detail.activity.actorTime', { actor: 'Mina Chen', time: '09:48' }), tone: 'success' },
    { title: t('pageTemplates.detail.activity.pciEvidence'), meta: t('pageTemplates.detail.activity.actorTime', { actor: t('pageTemplates.detail.activity.riskOffice'), time: '08:21' }), tone: 'neutral' },
    { title: t('pageTemplates.detail.activity.latencyAlert'), meta: t('pageTemplates.detail.activity.actorTime', { actor: t('pageTemplates.detail.activity.onCall'), time: t('pageTemplates.detail.auditTrail.yesterday') }), tone: 'warning' },
    { title: t('pageTemplates.detail.activity.failoverRehearsal'), meta: t('pageTemplates.detail.activity.actorTime', { actor: 'SRE', time: t('pageTemplates.detail.activity.jul5') }), tone: 'success' },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={service.status} label={t(`pageTemplates.status.${service.status}`)} />
              <Badge variant="outline">{t('pageTemplates.detail.pciScope')}</Badge>
              <Badge variant="outline">{t('pageTemplates.detail.tierOne')}</Badge>
            </div>
            <h2 className="text-2xl font-semibold">{service.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('pageTemplates.detail.ownedBy', { id: service.id, owner: service.owner })}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" icon={FileText}>{t('pageTemplates.actions.auditLog')}</Button>
            <Button icon={Send}>{t('pageTemplates.actions.requestChange')}</Button>
          </div>
        </div>

        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          {t('pageTemplates.detail.metadataWarning')}
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <MetricCard title={t('pageTemplates.metrics.availability')} value="99.982%" trend="+0.04%" icon={CheckCircle2} />
          <MetricCard title={t('pageTemplates.metrics.p95Latency')} value="128ms" trend="-18ms" icon={Activity} trendTone="good" />
          <MetricCard title={t('pageTemplates.metrics.errorBudget')} value={`${service.errorBudget}%`} trend="+7%" icon={ShieldCheck} />
          <MetricCard title={t('pageTemplates.metrics.costDrift')} value="+$1.8k" trend="+2.4%" icon={Database} />
        </div>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.detail.operationalContext.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.detail.operationalContext.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              [t('pageTemplates.detail.operationalContext.businessOwner'), 'Revenue Platform'],
              [t('pageTemplates.detail.operationalContext.technicalOwner'), 'FinOps Platform'],
              [t('pageTemplates.detail.operationalContext.dataSensitivity'), t('pageTemplates.detail.operationalContext.paymentMetadata')],
              [t('pageTemplates.detail.operationalContext.lastDeploy'), service.deploy],
              [t('pageTemplates.detail.operationalContext.runbook'), 'runbooks/payment-api.md'],
              [t('pageTemplates.detail.operationalContext.sloWindow'), t('pageTemplates.detail.operationalContext.rollingWindow')],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="mt-1 text-sm font-medium">{value}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.detail.capacity.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.detail.capacity.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              [t('pageTemplates.detail.capacity.apiNodes'), 68, 'default'],
              [t('pageTemplates.detail.capacity.databaseConnections'), 82, 'warning'],
              [t('pageTemplates.detail.capacity.cacheMemory'), 54, 'success'],
            ].map(([label, value, variant]) => (
              <div key={label as string} className="grid gap-2 md:grid-cols-[180px_minmax(0,1fr)_56px] md:items-center">
                <span className="text-sm font-medium">{label}</span>
                <Progress value={value as number} variant={variant as 'default' | 'warning' | 'success'} />
                <span className="text-sm text-muted-foreground">{value}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.detail.relationships.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.detail.relationships.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {dependencyRows.map(([name, relation, slo]) => (
              <div key={name} className="rounded-md border p-3">
                <div className="text-sm font-medium">{name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{relation}</div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span>{t('pageTemplates.detail.relationships.slo')}</span>
                  <span className="font-medium">{slo}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.detail.topology.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.detail.topology.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {runtimeRows.map(([kind, name, status], index) => (
              <div key={`${kind}-${name}`} className="flex items-center gap-3 rounded-md border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">{index + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{kind}</div>
                  <div className="truncate text-xs text-muted-foreground">{name}</div>
                </div>
                <StatusBadge status={status} label={t(`pageTemplates.status.${status}`)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.detail.catalog.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.detail.catalog.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              [t('pageTemplates.detail.catalog.owner'), 'group:finops-platform'],
              [t('pageTemplates.detail.catalog.system'), 'payments'],
              [t('pageTemplates.detail.catalog.lifecycle'), 'production'],
              [t('pageTemplates.detail.catalog.repository'), 'github.com/acme/payment-api'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{label}</span>
                <span className="truncate font-medium">{value}</span>
              </div>
            ))}
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">pagerduty-linked</Badge>
              <Badge variant="outline">grafana-linked</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.detail.checklist.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.detail.checklist.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              t('pageTemplates.detail.checklist.riskWaiver'),
              t('pageTemplates.detail.checklist.rollbackWindow'),
              t('pageTemplates.detail.checklist.syntheticChecks'),
            ].map((item, index) => (
              <label key={item} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                <Checkbox checked={index !== 1} />
                <span>{item}</span>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.detail.activity.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeline.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span
                  className={cn(
                    'mt-1 h-2.5 w-2.5 rounded-full',
                    item.tone === 'success' && 'bg-emerald-500',
                    item.tone === 'warning' && 'bg-amber-500',
                    item.tone === 'neutral' && 'bg-muted-foreground',
                  )}
                />
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.meta}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.detail.auditTrail.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.detail.auditTrail.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditRows.map(([time, action]) => (
              <div key={`${time}-${action}`} className="rounded-md border p-3 text-sm">
                <div className="text-xs text-muted-foreground">{time}</div>
                <div className="mt-1">{action}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function CreateTemplate() {
  const { t } = useTranslation();
  const reviewItems = useMemo(
    () => [
      t('pageTemplates.create.review.productionEnvironment'),
      t('pageTemplates.create.review.pciBoundary'),
      t('pageTemplates.create.review.autoscalingEnabled'),
      t('pageTemplates.create.review.ownerGroupSelected'),
    ],
    [t],
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <Card className="shadow-none">
          <CardContent className="grid gap-3 p-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-md border p-3">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                    index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-medium">{t(`pageTemplates.create.steps.${index}`)}</div>
                  <div className="text-xs text-muted-foreground">{index === 0 ? t('pageTemplates.create.steps.editing') : t('pageTemplates.create.steps.pending')}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.create.form.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.create.form.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field id="page-template-service-name" label={t('pageTemplates.create.form.serviceName')} reserveHint>
              <Input id="page-template-service-name" defaultValue="settlement-worker" />
            </Field>
            <Field id="page-template-owner-group" label={t('pageTemplates.create.form.ownerGroup')} reserveHint>
              <Select defaultValue="finops">
                <SelectTrigger id="page-template-owner-group" aria-labelledby="page-template-owner-group-label"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="finops">FinOps Platform</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="data">Data Intelligence</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field id="page-template-environment" label={t('pageTemplates.fields.environment')} reserveHint>
              <Select defaultValue="production">
                <SelectTrigger id="page-template-environment" aria-labelledby="page-template-environment-label"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">{t('pageTemplates.options.production')}</SelectItem>
                  <SelectItem value="staging">{t('pageTemplates.options.staging')}</SelectItem>
                  <SelectItem value="sandbox">{t('pageTemplates.options.sandbox')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field id="page-template-region" label={t('pageTemplates.fields.region')} reserveHint>
              <Select defaultValue="singapore">
                <SelectTrigger id="page-template-region" aria-labelledby="page-template-region-label"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                  <SelectItem value="frankfurt">Frankfurt</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field id="page-template-monthly-budget" label={t('pageTemplates.create.form.monthlyBudget')} hint={t('pageTemplates.create.form.budgetHint')} reserveHint>
              <Input id="page-template-monthly-budget" type="number" defaultValue="12000" />
            </Field>
            <Field id="page-template-change-window" label={t('pageTemplates.create.form.changeWindow')} reserveHint>
              <DateTimePickerField id="page-template-change-window" labelId="page-template-change-window-label" />
            </Field>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="page-template-business-justification">{t('pageTemplates.create.form.businessJustification')}</Label>
              <textarea
                id="page-template-business-justification"
                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                defaultValue={t('pageTemplates.create.form.justificationValue')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.create.guardrails.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.create.guardrails.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              [t('pageTemplates.create.guardrails.autoscaling'), t('pageTemplates.create.guardrails.autoscalingDesc')],
              [t('pageTemplates.create.guardrails.backup'), t('pageTemplates.create.guardrails.backupDesc')],
              [t('pageTemplates.create.guardrails.securityScan'), t('pageTemplates.create.guardrails.securityScanDesc')],
              [t('pageTemplates.create.guardrails.costAlert'), t('pageTemplates.create.guardrails.costAlertDesc')],
            ].map(([title, desc], index) => (
              <div key={title} className="flex items-center justify-between gap-4 rounded-md border p-3">
                <div>
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                <Switch defaultChecked={index !== 1} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.create.descriptor.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.create.descriptor.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md border bg-muted/30 p-4 text-xs leading-6 text-muted-foreground">
              <code>{catalogDescriptor}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.create.review.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.create.review.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviewItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
            <Separator />
            <div className="rounded-md bg-muted/40 p-3 text-sm">
              {t('pageTemplates.create.review.approvalRoute')}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" icon={Save}>{t('pageTemplates.actions.save')}</Button>
              <Button className="flex-1" icon={Send}>{t('pageTemplates.actions.submit')}</Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function SheetTemplate() {
  const { t } = useTranslation();
  const changeRows = [
    ['CHG-4281', t('pageTemplates.sheet.changes.connectionPool'), t('pageTemplates.sheet.changes.needsRiskReview')],
    ['CHG-4279', t('pageTemplates.sheet.changes.rotateSigningKey'), t('pageTemplates.sheet.changes.scheduled')],
    ['CHG-4274', t('pageTemplates.sheet.changes.promoteWorker'), t('pageTemplates.sheet.changes.waitingForOwner')],
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="shadow-none">
        <CardHeader>
            <CardTitle>{t('pageTemplates.sheet.queue.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.sheet.queue.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {changeRows.map(([id, title, state], index) => (
            <div key={id} className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{id}</span>
                  <StatusBadge status={index === 1 ? 'Active' : 'Warning'} label={state} />
                </div>
                <div className="mt-1 font-medium">{title}</div>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" icon={PanelRightOpen}>{t('pageTemplates.actions.review')}</Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl">
                  <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{t('pageTemplates.sheet.drawer.description', { id })}</SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto px-4">
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md border p-3">
                          <div className="text-xs text-muted-foreground">{t('pageTemplates.fields.risk')}</div>
                          <div className="mt-1 font-medium">{t('pageTemplates.risk.medium')}</div>
                        </div>
                        <div className="rounded-md border p-3">
                          <div className="text-xs text-muted-foreground">{t('pageTemplates.fields.window')}</div>
                          <div className="mt-1 font-medium">{t('pageTemplates.sheet.drawer.windowValue')}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{t('pageTemplates.sheet.drawer.impactSummary')}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {t('pageTemplates.sheet.drawer.impactDescription')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">{t('pageTemplates.sheet.drawer.evidence')}</h3>
                        {[
                          t('pageTemplates.sheet.drawer.loadTestReport'),
                          t('pageTemplates.sheet.drawer.rollbackScript'),
                          t('pageTemplates.sheet.drawer.ownerApproval'),
                        ].map((item) => (
                          <div key={item} className="flex items-center justify-between rounded-md border p-3 text-sm">
                            <span>{item}</span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <SheetFooter className="border-t">
                    <div className="flex gap-2">
                      <SheetClose asChild><Button variant="outline" className="flex-1">{t('pageTemplates.actions.return')}</Button></SheetClose>
                      <SheetClose asChild><Button className="flex-1">{t('pageTemplates.actions.approve')}</Button></SheetClose>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
            <CardTitle>{t('pageTemplates.sheet.policy.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.sheet.policy.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            t('pageTemplates.sheet.policy.keepListVisible'),
            t('pageTemplates.sheet.policy.reviewInContext'),
            t('pageTemplates.sheet.policy.footerActions'),
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span>{item}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DialogTemplate() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{t('pageTemplates.dialog.productionAction.title')}</CardTitle>
          <CardDescription>{t('pageTemplates.dialog.productionAction.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            {t('pageTemplates.dialog.productionAction.warning')}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" icon={Trash2}>{t('pageTemplates.actions.cancelKeyRotation')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('pageTemplates.dialog.confirm.title')}</DialogTitle>
                <DialogDescription>
                  {t('pageTemplates.dialog.confirm.description')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {[
                  [t('pageTemplates.dialog.confirm.currentKey'), t('pageTemplates.dialog.confirm.extension')],
                  [t('pageTemplates.dialog.confirm.affectedService'), 'Payment API'],
                  [t('pageTemplates.dialog.confirm.permissionScope'), 'security.keys.cancel'],
                  [t('pageTemplates.dialog.confirm.approvalRecord'), t('pageTemplates.dialog.confirm.auditRetention')],
                  [t('pageTemplates.dialog.confirm.requiredNote'), t('pageTemplates.dialog.confirm.noteReason')],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                <textarea
                  className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  placeholder={t('pageTemplates.dialog.confirm.notePlaceholder')}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">{t('pageTemplates.actions.keepSchedule')}</Button></DialogClose>
                <DialogClose asChild><Button variant="destructive">{t('pageTemplates.actions.cancelRotation')}</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{t('pageTemplates.dialog.routine.title')}</CardTitle>
          <CardDescription>{t('pageTemplates.dialog.routine.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            t('pageTemplates.dialog.routine.refreshOwnership'),
            t('pageTemplates.dialog.routine.rerunPolicy'),
            t('pageTemplates.dialog.routine.downloadEvidence'),
          ].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm">{item}</span>
              <Button variant="outline" size="sm">{t('pageTemplates.actions.run')}</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsTemplate() {
  const { t } = useTranslation();
  const annotationRows = [
    [t('pageTemplates.stats.annotations.jul03'), t('pageTemplates.stats.annotations.fraudDeploy')],
    [t('pageTemplates.stats.annotations.jul06'), t('pageTemplates.stats.annotations.failoverDrill')],
    [t('pageTemplates.stats.annotations.jul08'), t('pageTemplates.stats.annotations.poolTuning')],
  ];
  const attentionRows = [
    ['Identity Gateway', t('pageTemplates.stats.attentionQueue.connectionSaturation'), 'warning'],
    ['Executive Reporting', t('pageTemplates.stats.attentionQueue.pipelinePaused'), 'offline'],
    ['Payment API', t('pageTemplates.stats.attentionQueue.budgetDrift'), 'active'],
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t('pageTemplates.stats.metrics.fleetAvailability')} value="99.96%" trend="+0.08%" icon={Activity} />
        <MetricCard title={t('pageTemplates.stats.metrics.costForecast')} value="$1.42m" trend="-4.1%" icon={Database} trendTone="good" />
        <MetricCard title={t('pageTemplates.stats.metrics.policyPassRate')} value="96.4%" trend="+2.6%" icon={ShieldCheck} />
        <MetricCard title={t('pageTemplates.stats.metrics.changeLeadTime')} value="3.8h" trend="-1.2h" icon={Clock3} trendTone="good" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="shadow-none">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t('pageTemplates.stats.healthTrend.title')}</CardTitle>
              <CardDescription>{t('pageTemplates.stats.healthTrend.description')}</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select defaultValue="prod">
                <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="prod">{t('pageTemplates.options.production')}</SelectItem>
                  <SelectItem value="tier1">{t('pageTemplates.options.tierOneOnly')}</SelectItem>
                  <SelectItem value="all">{t('pageTemplates.options.allServices')}</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="30d">
                <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">{t('pageTemplates.options.last7Days')}</SelectItem>
                  <SelectItem value="30d">{t('pageTemplates.options.last30Days')}</SelectItem>
                  <SelectItem value="90d">{t('pageTemplates.options.last90Days')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-end gap-2 border-b border-l px-3 pb-3">
              {statSeries.map((value, index) => (
                <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{ height: `${value * 2.2}px` }}
                    title={`${value}%`}
                  />
                  <span className="text-[10px] text-muted-foreground">{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {annotationRows.map(([date, event]) => (
                <div key={event} className="rounded-md border bg-muted/20 p-3 text-xs">
                  <div className="font-medium">{date}</div>
                  <div className="mt-1 text-muted-foreground">{event}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.stats.attentionQueue.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.stats.attentionQueue.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attentionRows.map(([name, issue, status]) => (
              <div key={name} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{name}</div>
                  <StatusBadge status={status} label={t(`pageTemplates.status.${status}`)} />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{issue}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{t('pageTemplates.stats.variables.title')}</CardTitle>
            <CardDescription>{t('pageTemplates.stats.variables.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              [t('pageTemplates.fields.environment'), t('pageTemplates.options.production')],
              [t('pageTemplates.stats.variables.serviceTier'), t('pageTemplates.stats.variables.tierOneTwo')],
              [t('pageTemplates.stats.variables.ownerScope'), t('pageTemplates.stats.variables.allPlatformTeams')],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PageTemplateLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-full bg-background">
      <PageHeader title={title} subtitle={subtitle} />
      <main className="p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}

export function PageTemplateListPage() {
  const { t } = useTranslation();

  return (
    <PageTemplateLayout
      title={t('pageTemplates.pages.list.title')}
      subtitle={t('pageTemplates.pages.list.subtitle')}
    >
      <ListTemplate />
    </PageTemplateLayout>
  );
}

export function PageTemplateDetailPage() {
  const { t } = useTranslation();

  return (
    <PageTemplateLayout
      title={t('pageTemplates.pages.detail.title')}
      subtitle={t('pageTemplates.pages.detail.subtitle')}
    >
      <DetailTemplate />
    </PageTemplateLayout>
  );
}

export function PageTemplateCreatePage() {
  const { t } = useTranslation();

  return (
    <PageTemplateLayout
      title={t('pageTemplates.pages.create.title')}
      subtitle={t('pageTemplates.pages.create.subtitle')}
    >
      <CreateTemplate />
    </PageTemplateLayout>
  );
}

export function PageTemplateSheetPage() {
  const { t } = useTranslation();

  return (
    <PageTemplateLayout
      title={t('pageTemplates.pages.sheet.title')}
      subtitle={t('pageTemplates.pages.sheet.subtitle')}
    >
      <SheetTemplate />
    </PageTemplateLayout>
  );
}

export function PageTemplateDialogPage() {
  const { t } = useTranslation();

  return (
    <PageTemplateLayout
      title={t('pageTemplates.pages.dialog.title')}
      subtitle={t('pageTemplates.pages.dialog.subtitle')}
    >
      <DialogTemplate />
    </PageTemplateLayout>
  );
}

export function PageTemplateStatsPage() {
  const { t } = useTranslation();

  return (
    <PageTemplateLayout
      title={t('pageTemplates.pages.stats.title')}
      subtitle={t('pageTemplates.pages.stats.subtitle')}
    >
      <StatsTemplate />
    </PageTemplateLayout>
  );
}

export default PageTemplateListPage;
