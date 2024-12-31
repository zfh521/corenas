package router

import (
	"github.com/gin-gonic/gin"
	"github.com/zfh521/corenas/internal/api/middleware"
	"github.com/zfh521/corenas/internal/modules/auth"
	"github.com/zfh521/corenas/internal/modules/auth/service"
)

func SetupRouter(r *gin.Engine, authService service.AuthService) {
	// API 路由组
	api := r.Group("/api")
	
	// 注册不需要认证的路由
	auth.RegisterPublicRoutes(api, authService)

	// 添加认证中间件
	api.Use(middleware.Auth())
	
	// 注册需要认证的路由
	auth.RegisterProtectedRoutes(api, authService)
}
