import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

export default function Toaster() {
    const { toasts, dismissToast } = useStore();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
                        "bg-background text-foreground",
                        toast.variant === "destructive" && "bg-destructive text-destructive-foreground border-destructive",
                        toast.variant === "success" && "bg-green-600 text-white border-green-600"
                    )}
                >
                    <div className="grid gap-1">
                        {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
                        <div className="text-sm opacity-90">{toast.description}</div>
                    </div>
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="absolute right-2 top-2 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
