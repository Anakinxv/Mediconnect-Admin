import React from "react";
import { ArrowUp } from "lucide-react";

type MCMetricCardProps = {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  subtitle?: string;
  percentage?: string;
};

const MCMetricCard: React.FC<MCMetricCardProps> = ({
  title,
  icon,
  value,
  subtitle,
  percentage = "12%",
}) => {
  return (
    <div className="relative flex flex-col justify-start w-full rounded-4xl bg-background    p-6 transition-colors">
      {/* Header - Icon bubble + Title + Subtitle */}
      <div className="flex items-start gap-4 mb-5">
        <div className="flex items-center justify-center rounded-full w-15 h-15 bg-accent flex-shrink-0">
          <span className="text-xl text-primary flex items-center justify-center">
            {icon}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-[1.1rem] font-semibold mb-1.5 leading-tight text-foreground">
            {title}
          </div>
          {subtitle && (
            <div className="text-sm  text-muted-foreground font-normal leading-tight line-clamp-2 max-w-[90%] ">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="text-4xl font-bold mb-4 leading-none text-primary">
        {value}
      </div>

      {/* Stats - Percentage bubble + text */}
      <div className="flex items-center gap-2 mt-auto">
        <div className="flex items-center justify-center rounded-full w-fit h-fit py-2 px-3 bg-accent">
          <span className="text-xs font-medium text-primary flex items-center justify-center   ">
            <ArrowUp className="w-4 h-4 text-primary" />
            <p> {percentage}</p>
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">
            más que el mes pasado
          </span>
        </div>
      </div>
    </div>
  );
};

export default MCMetricCard;
