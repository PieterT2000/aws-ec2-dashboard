import { useDateRange } from "@/contexts/DateRangeContext";
import { formatDateAsDayMonth } from "@/lib/date-utils";

const WidgetTitle = ({
  children,
  displayDateRange = true,
}: {
  children: React.ReactNode;
  displayDateRange?: boolean;
}) => {
  const { dateRange } = useDateRange();
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-base font-medium dark:text-gray-300">
        {children}
        {displayDateRange && (
          <span className="text-sm text-muted-foreground">
            {" "}
            <>
              {dateRange?.from &&
                formatDateAsDayMonth(dateRange?.from.toISOString())}{" "}
              -{" "}
              {dateRange?.to &&
                formatDateAsDayMonth(dateRange?.to.toISOString())}
            </>
          </span>
        )}
      </h1>
    </div>
  );
};

export default WidgetTitle;
