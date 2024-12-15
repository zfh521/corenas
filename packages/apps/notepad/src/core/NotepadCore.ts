export interface NotepadState {
  content: string
  saved: boolean
  filename: string
  wordCount: number
  lineCount: number
}

export class NotepadCore {
  private state: NotepadState = {
    content: '',
    saved: true,
    filename: 'untitled.txt',
    wordCount: 0,
    lineCount: 1
  }

  getState(): NotepadState {
    return { ...this.state }
  }

  setState(state: Partial<NotepadState>): void {
    this.state = { ...this.state, ...state }
  }

  // 更新内容
  setContent(content: string): void {
    this.setState({
      content,
      saved: false,
      wordCount: this.countWords(content),
      lineCount: this.countLines(content)
    })
  }

  // 设置文件名
  setFilename(filename: string): void {
    this.setState({ filename })
  }

  // 标记为已保存
  markAsSaved(): void {
    this.setState({ saved: true })
  }

  // 清空内容
  clear(): void {
    this.setState({
      content: '',
      saved: true,
      filename: 'untitled.txt',
      wordCount: 0,
      lineCount: 1
    })
  }

  // 统计字数
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // 统计行数
  private countLines(text: string): number {
    return text.split('\n').length
  }

  // 获取文件内容
  getContent(): string {
    return this.state.content
  }

  // 获取文件名
  getFilename(): string {
    return this.state.filename
  }

  // 检查是否已保存
  isSaved(): boolean {
    return this.state.saved
  }
} 