package server

import (
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
	"github.com/zfh521/corenas/internal/handlers"
)

func NewRouter() *gin.Engine {
	router := gin.Default()

	// API路由组
	api := router.Group("/api")
	{
		users := api.Group("/users")
		{
			users.GET("/:id", handlers.GetUser)
			users.POST("", handlers.CreateUser)
		}
	}

	// 静态文件服务
	router.Static("/static", "./static")

	// WebSocket
	router.GET("/ws", handlers.HandleWebSocket)

	// Swagger文档
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return router
}
