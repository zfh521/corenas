package models

import (
    commonModels "github.com/zfh521/corenas/internal/common/models"
)

type User struct {
    commonModels.BaseModel
    Username string `json:"username" gorm:"uniqueIndex;not null"`
    Email    string `json:"email" gorm:"uniqueIndex;not null"`
    Password string `json:"-" gorm:"not null"`
    Role     string `json:"role" gorm:"default:user"`
} 