import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils.ts"

const SelectContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
} | null>(null)

function Select({
                    children,
                    value,
                    onValueChange,
                }: {
    children: React.ReactNode
    value?: string
    onValueChange?: (value: string) => void
}) {
    const [open, setOpen] = React.useState(false)
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative w-full">{children}</div>
        </SelectContext.Provider>
    )
}

const SelectGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-1", className)} {...props} />
))
SelectGroup.displayName = "SelectGroup"

function SelectValue({ placeholder }: { placeholder?: string }) {
    const context = React.useContext(SelectContext)
    return <span>{context?.value || placeholder}</span>
}

const SelectTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    return (
        <button
            ref={ref}
            type="button"
            onClick={() => context?.setOpen(!context.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    )
})
SelectTrigger.displayName = "SelectTrigger"

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: "top" | "bottom"
}

const SelectContent = React.forwardRef<
    HTMLDivElement,
    SelectContentProps
>(({ className, children, side = "bottom", ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context?.open) return null

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-transparent"
                onClick={() => context.setOpen(false)}
            />
            <div
                ref={ref}
                className={cn(
                    "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95 duration-100",
                    side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
                    className
                )}
                style={{ width: '100%' }}
                {...props}
            >
                <div className="p-1">{children}</div>
            </div>
        </>
    )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
    HTMLDivElement,
    { value: string; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, value, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    const isSelected = context?.value === value

    return (
        <div
            ref={ref}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                isSelected && "bg-accent text-accent-foreground",
                className
            )}
            onClick={() => {
                context?.onValueChange?.(value)
                context?.setOpen(false)
            }}
            {...props}
        >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
            <span>{children}</span>
        </div>
    )
})
SelectItem.displayName = "SelectItem"

const SelectLabel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
        {...props}
    />
))
SelectLabel.displayName = "SelectLabel"

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectLabel,
}
