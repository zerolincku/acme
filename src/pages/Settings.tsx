import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useStore } from '../store/useStore';
import { LogOut, Save, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const { currentUser, updateUser, logout, addToast } = useStore();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setEmail(currentUser.email);
        }
    }, [currentUser]);

    const handleSave = () => {
        updateUser({ name, email });
        addToast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
            variant: "success"
        });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        addToast({
            description: "You have been logged out.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" /> Profile Information
                        </CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Input disabled value={currentUser?.role || ''} className="bg-muted text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label>ID</Label>
                                <Input disabled value={currentUser?.id || ''} className="bg-muted text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-6">
                        <p className="text-sm text-muted-foreground">Last updated: Just now</p>
                        <Button onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </CardFooter>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/20">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>Irreversible and sensitive actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Sign out of your session on this device.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Log Out
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
