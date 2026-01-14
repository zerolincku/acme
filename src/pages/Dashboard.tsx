import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Minus, RotateCcw, Activity, Users, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { count, increment, decrement, reset } = useStore();

    const stats = [
        { title: "Total Revenue", value: "$45,231.89", icon: DollarSign, change: "+20.1% from last month" },
        { title: "Active Users", value: "+2350", icon: Users, change: "+180.1% from last month" },
        { title: "Active Sessions", value: "+12,234", icon: Activity, change: "+19% from last month" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your application state and metrics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Interactive State Demo */}
            <Card className="w-full md:w-1/2">
                <CardHeader>
                    <CardTitle>Zustand State Demo</CardTitle>
                    <CardDescription>
                        Manage global state effortlessly. Current count is shared across the app.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-10">
                    <div className="text-6xl font-bold tabular-nums tracking-tighter">
                        {count}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={reset}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={decrement} disabled={count <= 0}>
                            <Minus className="mr-2 h-4 w-4" /> Decrease
                        </Button>
                        <Button onClick={increment}>
                            <Plus className="mr-2 h-4 w-4" /> Increase
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Dashboard;
