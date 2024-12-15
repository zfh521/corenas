<template>
  <div class="calculator">
    <div class="display">{{ state.display }}</div>
    <div class="keypad">
      <button
        v-for="btn in buttons"
        :key="btn"
        @click="handleInput(btn)"
        :class="{ operator: isOperator(btn) }"
      >
        {{ btn }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CalculatorApp } from '../CalculatorApp'
import { CalculatorState } from '../core/CalculatorCore'

const props = defineProps<{
  app: CalculatorApp
}>()

const state = ref<CalculatorState>(props.app.getCalculatorState())

const buttons = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
  'C'
]

const isOperator = (btn: string) => {
  return ['+', '-', '*', '/', '='].includes(btn)
}

const handleInput = (btn: string) => {
  props.app.handleInput(btn)
}

// 监听状态变化
const handleStateChange = (event: any) => {
  state.value = event.payload
}

onMounted(() => {
  props.app.on('state:change', handleStateChange)
})

onUnmounted(() => {
  props.app.off('state:change', handleStateChange)
})
</script>

<style scoped>
.calculator {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  padding: 16px;
}

.display {
  background-color: white;
  padding: 16px;
  text-align: right;
  font-size: 24px;
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  flex: 1;
}

button {
  font-size: 18px;
  border: none;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #e0e0e0;
}

button.operator {
  background-color: #0078d4;
  color: white;
}

button.operator:hover {
  background-color: #006cbd;
}
</style> 