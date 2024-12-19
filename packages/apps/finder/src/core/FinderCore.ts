import { InMemoryFileSystem, FileSystemNode,WebDavFileSystem, FileSystemAPI } from '@corenas/core';

export class FinderCore {
  private fs: FileSystemAPI;
  private currentPath: string = '/';

  constructor() {
    this.fs = new WebDavFileSystem('http://localhost:9191/',"admin","password");
    this.initializeFileSystem();
  }

  private async initializeFileSystem() {
    try {
      // 创建基本目录结构
      await this.fs.createDirectory('/Users');
      await this.fs.createDirectory('/Applications');
      await this.fs.createDirectory('/Documents');
      await this.fs.createDirectory('/Downloads');
      
      // 添加一些示例文件
      await this.fs.writeFile('/Documents/welcome.txt', 'Welcome to Finder!');
      await this.fs.writeFile('/Documents/readme.md', '# Finder\nA file browser application');
    } catch (error) {
      console.error('Failed to initialize file system:', error);
    }
  }

  async getCurrentDirectory(): Promise<string[]> {
    return await this.fs.readDirectory(this.currentPath);
  }

  async getItemDetails(path: string): Promise<FileSystemNode> {
    return await this.fs.stat(path);
  }

  async navigateTo(path: string): Promise<void> {
    const exists = await this.fs.exists(path);
    if (!exists) {
      throw new Error(`Path does not exist: ${path}`);
    }
    const stat = await this.fs.stat(path);
    if (stat.type !== 'directory') {
      throw new Error(`Path is not a directory: ${path}`);
    }
    this.currentPath = path;
  }

  async createFolder(name: string): Promise<void> {
    const newPath = this.fs.join(this.currentPath, name);
    await this.fs.createDirectory(newPath);
  }

  async createFile(name: string, content: string = ''): Promise<void> {
    const newPath = this.fs.join(this.currentPath, name);
    await this.fs.createFile(newPath, content);
  }

  async delete(path: string): Promise<void> {
    await this.fs.delete(path);
  }

  async rename(oldPath: string, newName: string): Promise<void> {
    const parentPath = this.fs.dirname(oldPath);
    const newPath = this.fs.join(parentPath, newName);
    await this.fs.move(oldPath, newPath);
  }

  getParentPath(): string {
    return this.fs.dirname(this.currentPath);
  }

  canGoUp(): boolean {
    return this.currentPath !== '/';
  }
} 