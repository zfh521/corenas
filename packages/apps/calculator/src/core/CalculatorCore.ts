export interface CalculatorState {
  display: string
  currentNumber: string
  operator: string
  previousNumber: string
  newNumber: boolean
}

export class CalculatorCore {
  private state: CalculatorState = {
    display: '0',
    currentNumber: '',
    operator: '',
    previousNumber: '',
    newNumber: true
  }

  getState(): CalculatorState {
    return { ...this.state }
  }

  setState(state: Partial<CalculatorState>): void {
    this.state = { ...this.state, ...state }
  }

  reset(): void {
    this.state = {
      display: '0',
      currentNumber: '',
      previousNumber: '',
      operator: '',
      newNumber: true
    }
  }

  calculate(): void {
    const { previousNumber, currentNumber, operator } = this.state
    if (!previousNumber || !currentNumber || !operator) return

    const prev = parseFloat(previousNumber)
    const curr = parseFloat(currentNumber)
    let result = 0

    switch (operator) {
      case '+':
        result = prev + curr
        break
      case '-':
        result = prev - curr
        break
      case '*':
        result = prev * curr
        break
      case '/':
        result = prev / curr
        break
    }

    this.setState({
      display: result.toString(),
      currentNumber: result.toString(),
      previousNumber: '',
      operator: '',
      newNumber: true
    })
  }

  handleInput(btn: string): void {
    if (btn === 'C') {
      this.reset()
      return
    }

    if (btn === '.' && this.state.currentNumber.includes('.')) return

    if (['+', '-', '*', '/', '='].includes(btn)) {
      if (btn === '=') {
        this.calculate()
      } else {
        if (this.state.currentNumber) {
          if (this.state.previousNumber) {
            this.calculate()
          }
          this.setState({
            previousNumber: this.state.currentNumber,
            operator: btn,
            newNumber: true
          })
        }
      }
    } else {
      if (this.state.newNumber) {
        this.setState({
          currentNumber: btn,
          display: btn,
          newNumber: false
        })
      } else {
        this.setState({
          currentNumber: this.state.currentNumber + btn,
          display: this.state.currentNumber + btn
        })
      }
    }
  }
} 