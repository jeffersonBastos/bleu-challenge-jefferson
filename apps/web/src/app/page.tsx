import { placeholder } from "@bleu-builders/tech-challenge-ui";
import { EventsList } from "../components/event-list";

export default function Home() {
  return (
    <div>
      {/* List of all events */}
      <div className="flex flex-col gap-2">
        <EventsList />
      </div>
    </div>
  );
}
