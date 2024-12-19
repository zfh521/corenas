import { FileSystemAPI, FileSystemNode } from '../types/filesystem';

export class InMemoryFileSystem implements FileSystemAPI {
  private nodes: Map<string, FileSystemNode>;
  private readonly root: string = '/';

  constructor() {
    this.nodes = new Map();
    // 初始化根目录
    this.nodes.set(this.root, {
      name: '',
      type: 'directory',
      path: this.root,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      children: []
    });
  }

  private validatePath(path: string): string {
    // 标准化路径
    path = path.startsWith('/') ? path : `/${path}`;
    path = path.replace(/\/+/g, '/');
    return path === '' ? '/' : path;
  }

  private getParentPath(path: string): string {
    const normalized = this.validatePath(path);
    return normalized === '/' ? '/' : this.dirname(normalized);
  }

  private async ensureParentExists(path: string): Promise<void> {
    const parentPath = this.getParentPath(path);
    const exists = await this.exists(parentPath);
    if (!exists) {
      throw new Error(`Parent directory does not exist: ${parentPath}`);
    }
    const parent = await this.stat(parentPath);
    if (parent.type !== 'directory') {
      throw new Error(`Parent path is not a directory: ${parentPath}`);
    }
  }

  async createFile(path: string, content: string | ArrayBuffer = ''): Promise<void> {
    const normalizedPath = this.validatePath(path);
    await this.ensureParentExists(normalizedPath);

    if (await this.exists(normalizedPath)) {
      throw new Error(`File already exists: ${normalizedPath}`);
    }

    const parentPath = this.getParentPath(normalizedPath);
    const parent = await this.stat(parentPath);

    const newFile: FileSystemNode = {
      name: this.basename(normalizedPath),
      type: 'file',
      path: normalizedPath,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      content,
      size: content instanceof ArrayBuffer ? content.byteLength : content.length,
      parent: parentPath
    };

    this.nodes.set(normalizedPath, newFile);
    parent.children = parent.children || [];
    parent.children.push(normalizedPath);
    parent.modifiedAt = Date.now();
    this.nodes.set(parentPath, parent);
  }

  async createDirectory(path: string): Promise<void> {
    const normalizedPath = this.validatePath(path);
    await this.ensureParentExists(normalizedPath);

    if (await this.exists(normalizedPath)) {
      throw new Error(`Directory already exists: ${normalizedPath}`);
    }

    const parentPath = this.getParentPath(normalizedPath);
    const parent = await this.stat(parentPath);

    const newDir: FileSystemNode = {
      name: this.basename(normalizedPath),
      type: 'directory',
      path: normalizedPath,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      children: [],
      parent: parentPath
    };

    this.nodes.set(normalizedPath, newDir);
    parent.children = parent.children || [];
    parent.children.push(normalizedPath);
    parent.modifiedAt = Date.now();
    this.nodes.set(parentPath, parent);
  }

  async delete(path: string): Promise<void> {
    const normalizedPath = this.validatePath(path);
    if (!await this.exists(normalizedPath)) {
      throw new Error(`Path does not exist: ${normalizedPath}`);
    }

    const node = await this.stat(normalizedPath);
    if (node.type === 'directory' && node.children && node.children.length > 0) {
      // 递归删除子节点
      for (const childPath of node.children) {
        await this.delete(childPath);
      }
    }

    // 从父节点的children中移除
    if (node.parent) {
      const parent = await this.stat(node.parent);
      parent.children = parent.children?.filter(child => child !== normalizedPath);
      parent.modifiedAt = Date.now();
      this.nodes.set(node.parent, parent);
    }

    this.nodes.delete(normalizedPath);
  }

  async move(oldPath: string, newPath: string): Promise<void> {
    const normalizedOldPath = this.validatePath(oldPath);
    const normalizedNewPath = this.validatePath(newPath);

    if (!await this.exists(normalizedOldPath)) {
      throw new Error(`Source path does not exist: ${normalizedOldPath}`);
    }

    await this.copy(normalizedOldPath, normalizedNewPath);
    await this.delete(normalizedOldPath);
  }

  async copy(sourcePath: string, targetPath: string): Promise<void> {
    const normalizedSourcePath = this.validatePath(sourcePath);
    const normalizedTargetPath = this.validatePath(targetPath);

    const sourceNode = await this.stat(normalizedSourcePath);
    
    if (sourceNode.type === 'file') {
      const content = await this.readFile(normalizedSourcePath);
      await this.createFile(normalizedTargetPath, content);
    } else {
      await this.createDirectory(normalizedTargetPath);
      if (sourceNode.children) {
        for (const childPath of sourceNode.children) {
          const childName = this.basename(childPath);
          const newChildPath = this.join(normalizedTargetPath, childName);
          await this.copy(childPath, newChildPath);
        }
      }
    }
  }

  async readFile(path: string): Promise<string | ArrayBuffer> {
    const normalizedPath = this.validatePath(path);
    const node = await this.stat(normalizedPath);
    
    if (node.type !== 'file') {
      throw new Error(`Path is not a file: ${normalizedPath}`);
    }

    return node.content || '';
  }

  async readDirectory(path: string): Promise<string[]> {
    const normalizedPath = this.validatePath(path);
    const node = await this.stat(normalizedPath);
    
    if (node.type !== 'directory') {
      throw new Error(`Path is not a directory: ${normalizedPath}`);
    }

    return node.children || [];
  }

  async exists(path: string): Promise<boolean> {
    const normalizedPath = this.validatePath(path);
    return this.nodes.has(normalizedPath);
  }

  async stat(path: string): Promise<FileSystemNode> {
    const normalizedPath = this.validatePath(path);
    const node = this.nodes.get(normalizedPath);
    
    if (!node) {
      throw new Error(`Path does not exist: ${normalizedPath}`);
    }

    return { ...node };
  }

  async writeFile(path: string, content: string | ArrayBuffer): Promise<void> {
    const normalizedPath = this.validatePath(path);
    if (await this.exists(normalizedPath)) {
      const node = await this.stat(normalizedPath);
      if (node.type !== 'file') {
        throw new Error(`Path is not a file: ${normalizedPath}`);
      }
      node.content = content;
      node.size = content instanceof ArrayBuffer ? content.byteLength : content.length;
      node.modifiedAt = Date.now();
      this.nodes.set(normalizedPath, node);
    } else {
      await this.createFile(normalizedPath, content);
    }
  }

  join(...paths: string[]): string {
    return this.validatePath(paths.join('/'));
  }

  dirname(path: string): string {
    const normalizedPath = this.validatePath(path);
    if (normalizedPath === '/') return '/';
    const parts = normalizedPath.split('/');
    return parts.slice(0, -1).join('/') || '/';
  }

  basename(path: string): string {
    const normalizedPath = this.validatePath(path);
    if (normalizedPath === '/') return '';
    const parts = normalizedPath.split('/');
    return parts[parts.length - 1];
  }
} 