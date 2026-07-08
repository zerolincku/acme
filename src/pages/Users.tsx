import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useFetchData } from '@/hooks/use-fetch-data';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Plus, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { useStore } from '../store/useStore';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useDataTable } from '@/hooks/use-data-table';
import { ActionMenu, ActionMenuItem } from '@/components/ActionMenu';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { StatusBadge } from '@/components/ui/status-badge';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';

const ROLE_LABEL_KEY: Record<string, string> = {
    Admin: 'common.role.admin',
    Editor: 'common.role.editor',
    Viewer: 'common.role.viewer',
    Administrator: 'common.role.administrator',
};

const STATUS_LABEL_KEY: Record<'Active' | 'Inactive', string> = {
    Active: 'common.status.active',
    Inactive: 'common.status.inactive',
};

// Extended Mock Data for Pagination
const MOCK_USERS = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' as const },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' as const },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive' as const },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'Active' as const },
    { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'Viewer', status: 'Active' as const },
    { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'Viewer', status: 'Active' as const },
    { id: 7, name: 'George Martin', email: 'george@example.com', role: 'Admin', status: 'Inactive' as const },
    { id: 8, name: 'Hannah Abbott', email: 'hannah@example.com', role: 'Editor', status: 'Active' as const },
    { id: 9, name: 'Ian Somerhalder', email: 'ian@example.com', role: 'Viewer', status: 'Active' as const },
    { id: 10, name: 'Jane Doe', email: 'jane@example.com', role: 'Editor', status: 'Active' as const },
    { id: 11, name: 'Kyle Broflovski', email: 'kyle@example.com', role: 'Viewer', status: 'Inactive' as const },
    { id: 12, name: 'Liam Neeson', email: 'liam@example.com', role: 'Admin', status: 'Active' as const },
];

export default function Users() {
    const { t } = useTranslation();
    const addToast = useStore((state) => state.addToast);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 180);

    const { data: users = [], loading, error, refetch } = useFetchData(async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return MOCK_USERS;
    });

    const handleAddUser = () => {
        addToast({
            title: t('users.toast.title'),
            description: t('users.toast.description'),
        });
    };

    const query = debouncedSearchTerm.trim().toLowerCase();
    const filteredUsers = users.filter((user) =>
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );

    const table = useDataTable({
        rows: filteredUsers,
        initialPageSize: 10,
        pageSizeOptions: [10, 25, 50, 100],
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('users.title')}</h2>
                    <p className="text-muted-foreground">{t('users.subtitle')}</p>
                </div>
                <Button onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" /> {t('common.actions.addUser')}
                </Button>
            </div>

            <Card className="shadow-none">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>{t('users.allUsersTitle')}</CardTitle>
                            <CardDescription>{t('users.allUsersDescription')}</CardDescription>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t('users.searchPlaceholder')}
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    table.resetPage();
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">{t('users.columns.avatar')}</TableHead>
                                <TableHead>{t('users.columns.name')}</TableHead>
                                <TableHead>{t('users.columns.role')}</TableHead>
                                <TableHead>{t('users.columns.status')}</TableHead>
                                <TableHead className="text-right">{t('users.columns.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <TableSkeleton rows={3} columns={5} />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-destructive">
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
                                table.pagedRows.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{t(ROLE_LABEL_KEY[user.role] ?? user.role)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={user.status} label={t(STATUS_LABEL_KEY[user.status])} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ActionMenu ariaLabel={t('users.columns.actions')} contentClassName="w-36 p-1">
                                                {({ closeMenu }) => (
                                                    <ActionMenuItem
                                                        onClick={() => {
                                                            closeMenu();
                                                            addToast({
                                                                title: t('users.toast.title'),
                                                                description: t('users.toast.description'),
                                                            });
                                                        }}
                                                    >
                                                        {t('common.actions.select')}
                                                    </ActionMenuItem>
                                                )}
                                            </ActionMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <EmptyState title={t('users.noResults')} />
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
                                <Select
                                    value={table.pageSizeValue}
                                    onValueChange={table.setPageSizeValue}
                                >
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
                            {t('users.showingRange', {
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
