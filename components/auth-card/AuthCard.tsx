import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-border/50">
                <CardHeader className="space-y-2 text-center pb-6">
                    <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
                    <CardDescription className="text-base">{description}</CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    );
}
