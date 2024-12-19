package handlers

import (
	"github.com/gin-gonic/gin"
)

func ServeStatic(c *gin.Context) {
	// Gin的静态文件服务已经在server.go中通过router.Static配置
	// 这里可以添加额外的静态文件处理逻辑
} 