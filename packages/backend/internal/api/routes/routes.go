package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/swaggo/gin-swagger"
	"github.com/swaggo/files"
	"github.com/zfh521/corenas/internal/api/handlers"
	"github.com/zfh521/corenas/internal/api/middleware"
)

func SetupRoutes(r *gin.Engine) {
	// 中间件
	r.Use(middleware.Logger())
	r.Use(middleware.Recovery())

	// API v1
	v1 := r.Group("/api/v1")
	{
		// 公开接口
		public := v1.Group("")
		{
			public.POST("/login", handlers.Login)
			public.POST("/register", handlers.Register)
		}

		// 需要认证的接口
		protected := v1.Group("")
		protected.Use(middleware.Auth())
		{
			users := protected.Group("/users")
			{
				users.GET("", handlers.ListUsers)
				users.GET("/:id", handlers.GetUser)
				users.POST("", handlers.CreateUser)
				users.PUT("/:id", handlers.UpdateUser)
				users.DELETE("/:id", handlers.DeleteUser)
			}
		}
	}

	// Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
} 