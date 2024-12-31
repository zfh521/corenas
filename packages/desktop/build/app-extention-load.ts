
export default function appExtentionLoad() {
  return {
    name: 'vite-plugin-app-extention-load',
    apply: 'build',
    transform(code, id) {
        // 仅处理 JavaScript 文件
        if (!/\.(js|ts|jsx|tsx)$/.test(id)) return null;
  
        // 匹配 `import('@corenas/[module]')`
        const regex = /import\(['"]@corenas\/([^'"]+)['"]\)/g;
  
        // 替换路径为 `/apps/@corenas/[module]`
        const transformedCode = code.replace(regex, (match, moduleName) => {
          return `import('/apps/@corenas/${moduleName}')`;
        });
  
        // 如果没有发生替换，则返回 null，优化性能
        if (transformedCode === code) return null;
  
        return {
          code: transformedCode,
          map: null, // 如果需要 source map，可以生成
        };
    }
  }
}