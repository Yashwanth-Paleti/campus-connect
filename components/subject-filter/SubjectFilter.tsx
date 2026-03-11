import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubjectFilterProps {
    value: string;
    onChange: (value: string) => void;
    subjects: string[];
}

export function SubjectFilter({ value, onChange, subjects }: SubjectFilterProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
                {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                        {subject}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
