import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <CardContent
      className={cn("flex flex-col items-center justify-center p-6", className)}
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* Error Icon */}
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        {/* Error Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  );
}
