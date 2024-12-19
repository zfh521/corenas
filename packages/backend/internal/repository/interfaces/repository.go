package interfaces

import "github.com/zfh521/corenas/internal/models"

type UserRepository interface {
    Create(user *models.User) error
    Update(user *models.User) error
    Delete(id uint) error
    FindByID(id uint) (*models.User, error)
    FindByEmail(email string) (*models.User, error)
    List(page, limit int) ([]models.User, int64, error)
} 