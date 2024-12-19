package router

import (
	"github.com/gin-gonic/gin"
	"github.com/zfh521/corenas/internal/common/middleware"
	"github.com/zfh521/corenas/internal/modules/auth"
	"github.com/zfh521/corenas/internal/modules/system"
	"github.com/zfh521/corenas/internal/modules/manage"
)

func SetupRouter(r *gin.Engine) {
	// 全局中间件
	r.Use(middleware.Logger())
	r.Use(middleware.Recovery())

	// API v1
	v1 := r.Group("/api/v1")
	
	// 注册各模块路由
	auth.RegisterRoutes(v1, authHandler)
	system.RegisterRoutes(v1, systemHandler)
	manage.RegisterRoutes(v1, manageHandler)

	// Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
} 