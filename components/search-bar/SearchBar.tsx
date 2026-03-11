import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search resources..." }: SearchBarProps) {
    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
                type="search"
                className="pl-9 w-full bg-background border-border shadow-sm"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
