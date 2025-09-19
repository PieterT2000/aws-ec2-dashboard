const DashboardSection = ({
  children,
  title,
  controls,
}: {
  children: React.ReactNode;
  title: string;
  controls?: React.ReactNode;
}) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {controls}
      </div>
      {children}
    </div>
  );
};

export default DashboardSection;
