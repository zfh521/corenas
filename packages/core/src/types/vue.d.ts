import { ComponentPublicInstance } from 'vue'

declare module 'vue' {
  export interface ComponentCustomProperties {
    $eventBus: import('../events/EventBus').EventBus
  }
}

export type VueInstance = ComponentPublicInstance 