package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/zfh521/corenas/internal/modules/auth/handlers"
	"github.com/zfh521/corenas/internal/modules/auth/service"
)

// RegisterPublicRoutes 注册不需要认证的路由
func RegisterPublicRoutes(r *gin.RouterGroup, authService service.AuthService) {
	handler := handlers.NewAuthHandler(authService)

	auth := r.Group("/auth")
	{
		auth.POST("/login", handler.Login)
		auth.POST("/register", handler.Register)
	}
}

// RegisterProtectedRoutes 注册需要认证的路由
func RegisterProtectedRoutes(r *gin.RouterGroup, authService service.AuthService) {
	handler := handlers.NewAuthHandler(authService)

	auth := r.Group("/auth")
	{
		// 这里添加需要认证的路由
		// 例如：
		auth.POST("/logout", handler.Logout)
		auth.PUT("/password", handler.ChangePassword)
		auth.GET("/profile", handler.GetProfile)
	}
}
