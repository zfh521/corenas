package interfaces

import "github.com/zfh521/corenas/internal/models"

type UserService interface {
    CreateUser(input *models.UserCreate) (*models.User, error)
    UpdateUser(id uint, input *models.UserUpdate) (*models.User, error)
    DeleteUser(id uint) error
    GetUser(id uint) (*models.User, error)
    ListUsers(page, limit int) ([]models.User, int64, error)
} 