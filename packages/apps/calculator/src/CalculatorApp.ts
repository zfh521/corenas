import { BaseApp } from '@corenas/app-framework'
import { CalculatorCore, CalculatorState } from './core/CalculatorCore'

export class CalculatorApp extends BaseApp {
  private core: CalculatorCore

  constructor(context: any) {
    super(context)
    this.core = new CalculatorCore()
  }

  async init(): Promise<void> {
    // 恢复保存的状态
    const savedState = this.getState<CalculatorState>('state')
    if (savedState) {
      this.core.setState(savedState)
    }

    // 每次状态变化时保存
    this.on('state:change', () => {
      this.setState('state', this.core.getState())
    })
  }

  async destroy(): Promise<void> {
    // 清理状态
    this.clearState('state')
  }

  // 获取计算器状态
  getCalculatorState(): CalculatorState {
    return this.core.getState()
  }

  // 处理按钮输入
  handleInput(btn: string): void {
    this.core.handleInput(btn)
    this.emit({
      type: 'state:change',
      payload: this.core.getState()
    })
  }
} 