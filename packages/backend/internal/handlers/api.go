package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// @Summary 获取用户信息
// @Description 获取用户详细信息的API
// @Tags 用户
// @Accept json
// @Produce json
// @Param id path string true "用户ID"
// @Success 200 {object} map[string]interface{}
// @Router /api/users/{id} [get]
func GetUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"id": id,
		"name": "测试用户",
		"email": "test@example.com",
	})
}

// @Summary 创建用户
// @Description 创建新用户的API
// @Tags 用户
// @Accept json
// @Produce json
// @Param user body UserCreate true "用户信息"
// @Success 201 {object} map[string]interface{}
// @Router /api/users [post]
func CreateUser(c *gin.Context) {
	var user UserCreate
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{
		"message": "用户创建成功",
		"user": user,
	})
}

// UserCreate 用户创建请求结构
type UserCreate struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
} 