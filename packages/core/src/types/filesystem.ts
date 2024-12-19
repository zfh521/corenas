export type FileType = 'file' | 'directory';

export interface FileSystemNode {
  name: string;
  type: FileType;
  path: string;
  createdAt: number;
  modifiedAt: number;
  size?: number;
  content?: string | ArrayBuffer;
  parent?: string;
  children?: string[]; // 存储子节点的路径
}

export interface FileSystemAPI {
  // 基础文件操作
  createFile(path: string, content?: string | ArrayBuffer): Promise<void>;
  createDirectory(path: string): Promise<void>;
  delete(path: string): Promise<void>;
  move(oldPath: string, newPath: string): Promise<void>;
  copy(sourcePath: string, targetPath: string): Promise<void>;
  
  // 读取操作
  readFile(path: string): Promise<string | ArrayBuffer>;
  readDirectory(path: string): Promise<string[]>;
  exists(path: string): Promise<boolean>;
  stat(path: string): Promise<FileSystemNode>;
  
  // 写入操作
  writeFile(path: string, content: string | ArrayBuffer): Promise<void>;
  
  // 路径操作
  join(...paths: string[]): string;
  dirname(path: string): string;
  basename(path: string): string;
}

export interface FileSystemError extends Error {
  code: string;
  path?: string;
} 