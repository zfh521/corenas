package main

import (
	"github.com/gin-gonic/gin"
	"github.com/zfh521/corenas/internal/config"
	"github.com/zfh521/corenas/internal/core/database"
	"github.com/zfh521/corenas/internal/router"
)

func main() {
	// 初始化配置
	cfg := config.Load()

	// 初始化数据库
	db := database.Init(cfg.Database)

	// 创建Gin实例
	r := gin.Default()

	// 设置路由
	router.SetupRouter(r)

	// 启动服务
	r.Run(cfg.Server.Address)
} 