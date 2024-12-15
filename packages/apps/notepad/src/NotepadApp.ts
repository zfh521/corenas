import { BaseApp } from '@corenas/app-framework'
import { NotepadCore, NotepadState } from './core/NotepadCore'

export class NotepadApp extends BaseApp {
  private core: NotepadCore

  constructor(context: any) {
    super(context)
    this.core = new NotepadCore()
  }

  async init(): Promise<void> {
    // 恢复保存的状态
    const savedState = this.getState<NotepadState>('state')
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

  // 获取记事本状态
  getNotepadState(): NotepadState {
    return this.core.getState()
  }

  // 更新内容
  setContent(content: string): void {
    this.core.setContent(content)
    this.emit({
      type: 'state:change',
      payload: this.core.getState()
    })
  }

  // 保存文件
  async saveFile(filename?: string): Promise<void> {
    if (filename) {
      this.core.setFilename(filename)
    }
    
    // 创建 Blob 对���
    const blob = new Blob([this.core.getContent()], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // 创建下载链接
    const a = document.createElement('a')
    a.href = url
    a.download = this.core.getFilename()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // 标记为已保存
    this.core.markAsSaved()
    this.emit({
      type: 'state:change',
      payload: this.core.getState()
    })
  }

  // 新建文件
  newFile(): void {
    this.core.clear()
    this.emit({
      type: 'state:change',
      payload: this.core.getState()
    })
  }

  // 检查是否有未保存的更改
  hasUnsavedChanges(): boolean {
    return !this.core.isSaved()
  }
} 