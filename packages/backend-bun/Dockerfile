# 使用官方 Bun 镜像作为基础镜像
FROM oven/bun:1.0.30

# 设置工作目录
WORKDIR /app

# 复制 packageon 和 tsconfigon
COPY packageon tsconfigon ./

# 安装依赖
RUN bun install

# 复制源代码
COPY . .

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["bun", "run", "start"] 