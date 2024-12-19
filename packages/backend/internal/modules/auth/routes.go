package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/zfh521/corenas/internal/modules/auth/handlers"
)

func RegisterRoutes(r *gin.RouterGroup, authHandler *handlers.AuthHandler) {
	auth := r.Group("/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/register", authHandler.Register)
		auth.POST("/refresh", authHandler.RefreshToken)
	}
} 