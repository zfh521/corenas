package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/zfh521/corenas/internal/api/handlers"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			handlers.ErrorResponse(c, 401, "unauthorized")
			c.Abort()
			return
		}

		// TODO: 验证token

		c.Next()
	}
}
