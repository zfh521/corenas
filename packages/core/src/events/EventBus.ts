import { Event, EventHandler, EventEmitter } from '../types'

export class EventBus implements EventEmitter {
  private handlers: Map<string, Set<EventHandler>> = new Map()

  emit(event: Event): void {
    const handlers = this.handlers.get(event.type)
    if (handlers) {
      handlers.forEach(handler => handler(event))
    }
  }

  on(type: string, handler: EventHandler): void {
    let handlers = this.handlers.get(type)
    if (!handlers) {
      handlers = new Set()
      this.handlers.set(type, handlers)
    }
    handlers.add(handler)
  }

  off(type: string, handler: EventHandler): void {
    const handlers = this.handlers.get(type)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.handlers.delete(type)
      }
    }
  }
} 