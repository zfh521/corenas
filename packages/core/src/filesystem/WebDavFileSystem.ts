import { FileSystemAPI, FileSystemNode, FileType } from '../types/filesystem';
import { createClient, FileStat, ResponseDataDetailed, WebDAVClient } from 'webdav';

export class WebDavFileSystem implements FileSystemAPI {
  private client: WebDAVClient;

  constructor(url: string, username?: string, password?: string) {
    this.client = createClient(url, {
      username,
      password
    });
  }

  private async convertToFileSystemNode(stat: any, path: string): Promise<FileSystemNode> {
    const type: FileType = stat.type === 'directory' ? 'directory' : 'file';
    return {
      name: this.basename(path),
      type,
      path,
      createdAt: new Date(stat.created).getTime(),
      modifiedAt: new Date(stat.lastmod).getTime(),
      size: stat.size,
      parent: this.dirname(path),
      children: type === 'directory' ? [] : undefined
    };
  }

  async createFile(path: string, content: string | ArrayBuffer = ''): Promise<void> {
    const normalizedPath = this.validatePath(path);
    await this.client.putFileContents(normalizedPath, content);
  }

  async createDirectory(path: string): Promise<void> {
    const normalizedPath = this.validatePath(path);
    await this.client.createDirectory(normalizedPath);
  }

  async delete(path: string): Promise<void> {
    const normalizedPath = this.validatePath(path);
    await this.client.deleteFile(normalizedPath);
  }

  async move(oldPath: string, newPath: string): Promise<void> {
    const normalizedOldPath = this.validatePath(oldPath);
    const normalizedNewPath = this.validatePath(newPath);
    await this.client.moveFile(normalizedOldPath, normalizedNewPath);
  }

  async copy(sourcePath: string, targetPath: string): Promise<void> {
    const normalizedSourcePath = this.validatePath(sourcePath);
    const normalizedTargetPath = this.validatePath(targetPath);
    await this.client.copyFile(normalizedSourcePath, normalizedTargetPath);
  }

  async readFile(path: string): Promise<string | ArrayBuffer > {
    const normalizedPath = this.validatePath(path);
    const fileContents = await this.client.getFileContents(normalizedPath, { format: 'binary' });
    return fileContents as string | ArrayBuffer;
  }

  async readDirectory(path: string): Promise<string[]> {
    const normalizedPath = this.validatePath(path);
    const contents = await this.client.getDirectoryContents(normalizedPath);
    if(Array.isArray(contents)){
      return contents.map(item=>item.filename)
    }else{
      return (contents as ResponseDataDetailed<Array<FileStat>>).data.map(item=>item.filename)
    }
  }

  async exists(path: string): Promise<boolean> {
    const normalizedPath = this.validatePath(path);
    try {
      await this.client.stat(normalizedPath);
      return true;
    } catch {
      return false;
    }
  }

  async stat(path: string): Promise<FileSystemNode> {
    const normalizedPath = this.validatePath(path);
    const stat = await this.client.stat(normalizedPath);
    return await this.convertToFileSystemNode(stat, normalizedPath);
  }

  async writeFile(path: string, content: string | ArrayBuffer): Promise<void> {
    const normalizedPath = this.validatePath(path);
    await this.client.putFileContents(normalizedPath, content);
  }

  private validatePath(path: string): string {
    // 标准化路径
    path = path.startsWith('/') ? path : `/${path}`;
    path = path.replace(/\/+/g, '/');
    return path === '' ? '/' : path;
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