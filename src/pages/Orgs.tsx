import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Plus, Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { useDataTable } from '@/hooks/use-data-table';
import { ActionMenu, ActionMenuItem } from '@/components/ActionMenu';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { StatusBadge } from '@/components/ui/status-badge';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';

const ORG_TYPE_LABEL_KEY: Record<string, string> = {
    University: 'orgs.types.university',
    Hospital: 'orgs.types.hospital',
    Corporate: 'orgs.types.corporate',
    Government: 'orgs.types.government',
    'Public Service': 'orgs.types.publicService',
};

const STATUS_LABEL_KEY: Record<'Active' | 'Inactive', string> = {
    Active: 'common.status.active',
    Inactive: 'common.status.inactive',
};

// Mock Data for Orgs
const MOCK_ORGS = [
    { id: 1, name: 'Global Tech University', type: 'University', location: 'San Francisco, CA', status: 'Active' as const, head: 'Dr. Aris Thorne' },
    { id: 2, name: 'City General Hospital', type: 'Hospital', location: 'New York, NY', status: 'Active' as const, head: 'Sarah Jenkins' },
    { id: 3, name: 'Innovate Corp', type: 'Corporate', location: 'Austin, TX', status: 'Active' as const, head: 'Mark Zuckerberg' },
    { id: 4, name: 'National Research Lab', type: 'Government', location: 'Washington, DC', status: 'Inactive' as const, head: 'Jane Foster' },
    { id: 5, name: 'Heritage Museum', type: 'Public Service', location: 'Chicago, IL', status: 'Active' as const, head: 'Arthur Dent' },
    { id: 6, name: "St. Mary's Academy", type: 'University', location: 'Boston, MA', status: 'Active' as const, head: 'Sister Mary' },
    { id: 7, name: 'HealthPlus Clinic', type: 'Hospital', location: 'Miami, FL', status: 'Inactive' as const, head: 'Robert Liston' },
    { id: 8, name: 'Nexus Software Solutions', type: 'Corporate', location: 'Seattle, WA', status: 'Active' as const, head: 'Bill Gates' },
    { id: 9, name: 'Defense Systems Agency', type: 'Government', location: 'Arlington, VA', status: 'Active' as const, head: 'Nick Fury' },
    { id: 10, name: 'Community Arts Center', type: 'Public Service', location: 'Portland, OR', status: 'Active' as const, head: 'Bob Ross' },
    { id: 11, name: 'Northern Star Energy', type: 'Corporate', location: 'Houston, TX', status: 'Active' as const, head: 'Elon Musk' },
    { id: 12, name: 'East Coast Medical', type: 'Hospital', location: 'Philadelphia, PA', status: 'Active' as const, head: 'Gregory House' },
];

export default function Orgs() {
    const { t } = useTranslation();
    const addToast = useStore((state) => state.addToast);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Filter States
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<'Active' | 'Inactive' | undefined>(undefined);
    const [locationFilter, setLocationFilter] = useState('');
    const debouncedSearch = useDebouncedValue(search, 180);
    const debouncedLocation = useDebouncedValue(locationFilter, 180);

    const { data: orgs = [], loading, error, refetch } = useFetchData(async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return MOCK_ORGS;
    });

    const handleAddOrg = () => {
        addToast({
            title: t('orgs.toast.title'),
            description: t('orgs.toast.description'),
        });
    };

    const resetFilters = () => {
        setSearch('');
        setTypeFilter(undefined);
        setStatusFilter(undefined);
        setLocationFilter('');
        table.resetPage();
    };

    const searchQuery = debouncedSearch.trim().toLowerCase();
    const locationQuery = debouncedLocation.trim().toLowerCase();
    const filteredData = orgs.filter((item) => {
        const matchesSearch =
            !searchQuery ||
            item.name.toLowerCase().includes(searchQuery) ||
            item.head.toLowerCase().includes(searchQuery);
        const matchesType = !typeFilter || item.type === typeFilter;
        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesLocation = !locationQuery || item.location.toLowerCase().includes(locationQuery);

        return matchesSearch && matchesType && matchesStatus && matchesLocation;
    });

    const table = useDataTable({
        rows: filteredData,
        initialPageSize: 10,
        pageSizeOptions: [10, 25, 50, 100],
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('orgs.title')}</h2>
                    <p className="text-muted-foreground">{t('orgs.subtitle')}</p>
                </div>
                <Button onClick={handleAddOrg}>
                    <Plus className="mr-2 h-4 w-4" /> {t('common.actions.addOrg')}
                </Button>
            </div>

            <Card className="shadow-none">
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('orgs.searchPlaceholder')}
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        table.resetPage();
                                    }}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn('h-10 gap-2 font-medium', showAdvancedFilters && 'bg-accent')}
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            >
                                <Filter className="h-4 w-4" />
                                <span>{t('common.actions.filters')}</span>
                                {showAdvancedFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </Button>
                        </div>
                    </div>

                    {showAdvancedFilters && (
                        <div className="mt-4 p-4 border rounded-lg bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-0">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t('orgs.filterType')}</Label>
                                    <Select
                                        value={typeFilter || "all"}
                                        onValueChange={(val: string) => { setTypeFilter(val === "all" ? undefined : val); table.resetPage(); }}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder={t('orgs.selectTypePlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('orgs.allTypes')}</SelectItem>
                                            <SelectItem value="University">{t('orgs.types.university')}</SelectItem>
                                            <SelectItem value="Hospital">{t('orgs.types.hospital')}</SelectItem>
                                            <SelectItem value="Corporate">{t('orgs.types.corporate')}</SelectItem>
                                            <SelectItem value="Government">{t('orgs.types.government')}</SelectItem>
                                            <SelectItem value="Public Service">{t('orgs.types.publicService')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-0">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t('orgs.filterStatus')}</Label>
                                    <Select
                                        value={statusFilter || "all"}
                                        onValueChange={(val: string) => { setStatusFilter(val === "all" ? undefined : val as 'Active' | 'Inactive'); table.resetPage(); }}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder={t('orgs.selectStatusPlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('orgs.allStatus')}</SelectItem>
                                            <SelectItem value="Active">{t('common.status.active')}</SelectItem>
                                            <SelectItem value="Inactive">{t('common.status.inactive')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-0">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t('orgs.filterLocation')}</Label>
                                    <Input
                                        placeholder={t('orgs.locationPlaceholder')}
                                        className="h-9"
                                        value={locationFilter}
                                        onChange={(e) => { setLocationFilter(e.target.value); table.resetPage(); }}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button variant="ghost" size="sm" className="h-9 w-full text-xs font-semibold" onClick={resetFilters}>
                                        <X className="mr-2 h-3 w-3" /> {t('common.actions.reset')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('orgs.columns.orgName')}</TableHead>
                                <TableHead>{t('orgs.columns.type')}</TableHead>
                                <TableHead>{t('orgs.columns.location')}</TableHead>
                                <TableHead>{t('orgs.columns.headOfDept')}</TableHead>
                                <TableHead>{t('orgs.columns.status')}</TableHead>
                                <TableHead className="text-right">{t('orgs.columns.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <TableSkeleton rows={3} columns={6} />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-destructive">
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
                                table.pagedRows.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-semibold">{item.name}</TableCell>
                                        <TableCell>
                                            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-md">
                                                {t(ORG_TYPE_LABEL_KEY[item.type] ?? item.type)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm">{item.location}</TableCell>
                                        <TableCell>{item.head}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={item.status} label={t(STATUS_LABEL_KEY[item.status])} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ActionMenu ariaLabel={t('orgs.columns.actions')} contentClassName="w-36 p-1">
                                                {({ closeMenu }) => (
                                                    <ActionMenuItem
                                                        onClick={() => {
                                                            closeMenu();
                                                            addToast({
                                                                title: t('orgs.toast.title'),
                                                                description: t('orgs.toast.description'),
                                                            });
                                                        }}
                                                    >
                                                        {t('common.actions.navigate')}
                                                    </ActionMenuItem>
                                                )}
                                            </ActionMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <EmptyState title={t('orgs.noResults')} />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span>{t('common.actions.show')}</span>
                            <div className="w-20">
                                <Select value={table.pageSizeValue} onValueChange={table.setPageSizeValue}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="5" />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {table.pageSizeOptions.map((size) => (
                                            <SelectItem key={size} value={String(size)}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <span>{t('common.actions.perPage')}</span>
                        </div>
                        <span className="opacity-70">
                            {t('orgs.showingRange', {
                                start: table.startItem,
                                end: table.endItem,
                                total: table.totalItems,
                            })}
                        </span>
                    </div>

                    <DataTablePagination table={table} className="mx-0 w-auto justify-end" />
                </CardFooter>
            </Card>
        </div>
    );
}
