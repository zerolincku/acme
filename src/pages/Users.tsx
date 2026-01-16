import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Plus, Search, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';

// Extended Mock Data for Pagination
const allUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Editor", status: "Active" },
    { id: 5, name: "Evan Wright", email: "evan@example.com", role: "Viewer", status: "Active" },
    { id: 6, name: "Fiona Gallagher", email: "fiona@example.com", role: "Viewer", status: "Active" },
    { id: 7, name: "George Martin", email: "george@example.com", role: "Admin", status: "Inactive" },
    { id: 8, name: "Hannah Abbott", email: "hannah@example.com", role: "Editor", status: "Active" },
    { id: 9, name: "Ian Somerhalder", email: "ian@example.com", role: "Viewer", status: "Active" },
    { id: 10, name: "Jane Doe", email: "jane@example.com", role: "Editor", status: "Active" },
    { id: 11, name: "Kyle Broflovski", email: "kyle@example.com", role: "Viewer", status: "Inactive" },
    { id: 12, name: "Liam Neeson", email: "liam@example.com", role: "Admin", status: "Active" },
];

const ITEMS_PER_PAGE = 5;

export default function Users() {
    const { addToast } = useStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddUser = () => {
        addToast({
            title: "Action Simulated",
            description: "Add user modal would open here.",
        });
    };

    // Filter Logic
    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage user access and permissions.</p>
                </div>
                <Button onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>A list of all users in your organization.</CardDescription>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Avatar</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
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
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>

                {/* Pagination Footer */}
                <CardFooter className="flex items-center justify-between space-x-2 border-t px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
                        {filteredUsers.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous</span>
                        </Button>
                        <div className="text-sm font-medium">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
