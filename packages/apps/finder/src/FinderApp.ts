import { AppContext, BaseApp } from '@corenas/app-framework';
import { FinderCore } from './core/FinderCore';

export class FinderApp extends BaseApp {
  public readonly core: FinderCore;

  constructor(context: AppContext) {
    super(context);
    this.core = new FinderCore();
  }

  async init(): Promise<void> {
    // 初始化应用
  }

  async destroy(): Promise<void> {
    // 清理资源
  }
}

export default FinderApp; 