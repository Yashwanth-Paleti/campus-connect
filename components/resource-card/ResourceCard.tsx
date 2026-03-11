import { Resource } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileText, Calendar, User as UserIcon } from "lucide-react";

interface ResourceCardProps {
    resource: Resource;
    currentUserId?: string;
    onDelete?: (id: string) => void;
}

export function ResourceCard({ resource, currentUserId, onDelete }: ResourceCardProps) {
    const isOwner = currentUserId === resource.uploaderId;

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/50 group bg-card">
            <CardHeader className="flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
                        {resource.subject}
                    </div>
                    {isOwner && onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onDelete(resource.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
                <CardTitle className="line-clamp-2 text-lg leading-tight mb-2">
                    {resource.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                    {resource.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
                <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>{resource.uploaderName} • Year {resource.uploaderYear}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{resource.uploadDate}</span>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button className="w-full gap-2 border border-primary/20" variant="secondary">
                    <Download className="w-4 h-4" /> Download PDF
                </Button>
            </CardFooter>
        </Card>
    );
}
