import { EventBus, createEventDefinition } from "ts-bus";

export const BUS = new EventBus();
export const SYNC_COMPLETE_EVENT = createEventDefinition<{ id: string }>()("SYNC_COMPLETE_EVENT");