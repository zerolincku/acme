import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Plus, Search, MoreHorizontal, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

// Mock Data for Orgs
const allOrgs = [
    { id: 1, name: "Global Tech University", type: "University", location: "San Francisco, CA", status: "Active", head: "Dr. Aris Thorne" },
    { id: 2, name: "City General Hospital", type: "Hospital", location: "New York, NY", status: "Active", head: "Sarah Jenkins" },
    { id: 3, name: "Innovate Corp", type: "Corporate", location: "Austin, TX", status: "Active", head: "Mark Zuckerberg" },
    { id: 4, name: "National Research Lab", type: "Government", location: "Washington, DC", status: "Inactive", head: "Jane Foster" },
    { id: 5, name: "Heritage Museum", type: "Public Service", location: "Chicago, IL", status: "Active", head: "Arthur Dent" },
    { id: 6, name: "St. Mary's Academy", type: "University", location: "Boston, MA", status: "Active", head: "Sister Mary" },
    { id: 7, name: "HealthPlus Clinic", type: "Hospital", location: "Miami, FL", status: "Inactive", head: "Robert Liston" },
    { id: 8, name: "Nexus Software Solutions", type: "Corporate", location: "Seattle, WA", status: "Active", head: "Bill Gates" },
    { id: 9, name: "Defense Systems Agency", type: "Government", location: "Arlington, VA", status: "Active", head: "Nick Fury" },
    { id: 10, name: "Community Arts Center", type: "Public Service", location: "Portland, OR", status: "Active", head: "Bob Ross" },
    { id: 11, name: "Northern Star Energy", type: "Corporate", location: "Houston, TX", status: "Active", head: "Elon Musk" },
    { id: 12, name: "East Coast Medical", type: "Hospital", location: "Philadelphia, PA", status: "Active", head: "Gregory House" },
];

export default function Orgs() {
    const { addToast } = useStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState("10");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Filter States
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('');

    const handleAddOrg = () => {
        addToast({
            title: "Org Management",
            description: "Opening registration form for new organization.",
        });
    };

    const resetFilters = () => {
        setSearch('');
        setTypeFilter('All');
        setStatusFilter('All');
        setLocationFilter('');
    };

    // Advanced Filter Logic
    const filteredData = allOrgs.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.head.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'All' || item.type === typeFilter;
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        const matchesLocation = item.location.toLowerCase().includes(locationFilter.toLowerCase());

        return matchesSearch && matchesType && matchesStatus && matchesLocation;
    });

    // Pagination Logic
    const pageSize = parseInt(itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentData = filteredData.slice(startIndex, startIndex + pageSize);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const renderPageItems = () => {
        const items = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink onClick={() => goToPage(i)} isActive={currentPage === i}>{i}</PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink onClick={() => goToPage(1)} isActive={currentPage === 1}>1</PaginationLink>
                </PaginationItem>
            );
            if (currentPage > 3) items.push(<PaginationEllipsis key="ellipsis-start" />);
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                if (i === 1 || i === totalPages) continue;
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink onClick={() => goToPage(i)} isActive={currentPage === i}>{i}</PaginationLink>
                    </PaginationItem>
                );
            }
            if (currentPage < totalPages - 2) items.push(<PaginationEllipsis key="ellipsis-end" />);
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => goToPage(totalPages)} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orgs</h2>
                    <p className="text-muted-foreground">Monitor and manage organizational partners and clients.</p>
                </div>
                <Button onClick={handleAddOrg}>
                    <Plus className="mr-2 h-4 w-4" /> Add Org
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Quick search by name or head..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn("h-10 gap-2 font-medium", showAdvancedFilters && "bg-accent")}
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filters</span>
                                {showAdvancedFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </Button>
                        </div>
                    </div>

                    {/* Advanced Search Panel */}
                    {showAdvancedFilters && (
                        <div className="mt-4 p-4 border rounded-lg bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Type</Label>
                                    <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Types</SelectItem>
                                            <SelectItem value="University">University</SelectItem>
                                            <SelectItem value="Hospital">Hospital</SelectItem>
                                            <SelectItem value="Corporate">Corporate</SelectItem>
                                            <SelectItem value="Government">Government</SelectItem>
                                            <SelectItem value="Public Service">Public Service</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Status</Label>
                                    <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Status</SelectItem>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Location</Label>
                                    <Input
                                        placeholder="Filter by city/state..."
                                        className="h-9"
                                        value={locationFilter}
                                        onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button variant="ghost" size="sm" className="h-9 w-full text-xs font-semibold" onClick={resetFilters}>
                                        <X className="mr-2 h-3 w-3" /> Reset
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
                                <TableHead>Org Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Head of Dept</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.length > 0 ? (
                                currentData.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-semibold">{item.name}</TableCell>
                                        <TableCell>
                                            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-md">{item.type}</span>
                                        </TableCell>
                                        <TableCell className="text-sm">{item.location}</TableCell>
                                        <TableCell>{item.head}</TableCell>
                                        <TableCell>
                      <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          item.status === 'Active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      )}>
                        {item.status}
                      </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No organizations matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span>Show</span>
                            <div className="w-20">
                                <Select value={itemsPerPage} onValueChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="5" />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <span>per page</span>
                        </div>
                        <span className="opacity-70">
               Showing {filteredData.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length}
             </span>
                    </div>

                    <Pagination className="justify-end w-auto mx-0">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => goToPage(currentPage - 1)}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            {renderPageItems()}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => goToPage(currentPage + 1)}
                                    className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardFooter>
            </Card>
        </div>
    );
}
