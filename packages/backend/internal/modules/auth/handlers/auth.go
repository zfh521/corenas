package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/zfh521/corenas/internal/common/response"
	"github.com/zfh521/corenas/internal/modules/auth/service"
)

type AuthHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// @Summary 用户登录
// @Tags 认证
// @Accept json
// @Produce json
// @Param login body LoginRequest true "登录信息"
// @Success 200 {object} response.Response
// @Router /api/v1/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "无效的请求参数")
		return
	}

	token, err := h.authService.Login(req.Username, req.Password)
	if err != nil {
		response.Error(c, 401, "登录失败")
		return
	}

	response.Success(c, gin.H{"token": token})
} 