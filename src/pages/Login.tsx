import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Cloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATHS } from '@/config/paths';
import { loginWithPassword } from '@/api/modules/auth';
import { useShallow } from 'zustand/react/shallow';

export default function Login() {
    const navigate = useNavigate();
    const { setSession, addToast } = useStore(
        useShallow((state) => ({
            setSession: state.setSession,
            addToast: state.addToast,
        })),
    );
    const { t } = useTranslation();
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (email && password) {
                const session = await loginWithPassword({ email, password });
                setSession(session);
                addToast({
                    title: t('login.successTitle'),
                    description: t('login.successDescription'),
                    variant: "success"
                });
                navigate(ROUTE_PATHS.DASHBOARD);
            } else {
                addToast({
                    title: t('login.errorTitle'),
                    description: t('login.errorDescription'),
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Login failed:', error);
            addToast({
                title: t('login.errorTitle'),
                description: error instanceof Error ? error.message : t('login.errorDescription'),
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
            {/* Subtle background decoration */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-primary/3 blur-3xl" />

            <Card className="relative w-full max-w-md border-border/50">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                            <Cloud className="h-7 w-7 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
                    <CardDescription>
                        {t('login.description')}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-0">
                            <Label htmlFor="email">{t('login.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('login.emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-0">
                            <Label htmlFor="password">{t('login.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? t('common.actions.signingIn') : t('common.actions.signIn')}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
