import React from "react";
import { Loader2 } from "lucide-react";

// Define the structure of a processed event for the timeline
export interface ProcessedEvent {
  id: string;
  timestamp: string;
  name: string;
  message: string;
  color: string;
}

// Props for the ActivityTimeline component
interface ActivityTimelineProps {
  processedEvents: ProcessedEvent[];
  isLoading: boolean;
}

// The ActivityTimeline component
export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  processedEvents,
  isLoading,
}) => {
  return (
    <div className="text-left">
      <ol className="relative border-l border-neutral-700">
        {processedEvents.map((event, index) => (
          <li key={event.id} className="mb-4 ml-4">
            <div
              className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border border-white ${event.color}`}
            />
            <p className="text-xs text-neutral-400">{event.name}</p>
            <p className="text-xs text-neutral-300">{event.message}</p>
          </li>
        ))}
        {isLoading && (
          <li className="mb-4 ml-4">
            <div className="absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border border-white bg-neutral-500" />
            <p className="text-xs text-neutral-400">AI is thinking...</p>
            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
          </li>
        )}
      </ol>
    </div>
  );
};