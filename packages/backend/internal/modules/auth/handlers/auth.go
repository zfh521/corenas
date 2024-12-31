package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/zfh521/corenas/internal/api/handlers"
	"github.com/zfh521/corenas/internal/modules/auth/models"
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
	fmt.Println("login request invoked")
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		handlers.ErrorResponse(c, 400, err.Error())
		return
	}

	token, err := h.authService.Login(c.Request.Context(), req)
	if err != nil {
		handlers.ErrorResponse(c, 401, err.Error())
		return
	}

	handlers.SuccessResponse(c, models.LoginResponse{Token: token})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		handlers.ErrorResponse(c, 400, err.Error())
		return
	}

	err := h.authService.Register(c.Request.Context(), req)
	if err != nil {
		handlers.ErrorResponse(c, 400, err.Error())
		return
	}

	handlers.SuccessResponse(c, nil)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// TODO: 实现登出逻辑
	handlers.SuccessResponse(c, nil)
}

func (h *AuthHandler) ChangePassword(c *gin.Context) {
	// TODO: 实现修改密码逻辑
	handlers.SuccessResponse(c, nil)
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	// TODO: 实现获取用户信息逻辑
	handlers.SuccessResponse(c, nil)
}
