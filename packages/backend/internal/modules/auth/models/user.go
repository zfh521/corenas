package models

import "github.com/zfh521/corenas/internal/common/models"

type User struct {
    models.Base
    Username string `json:"username" gorm:"size:100;not null;unique"`
    Password string `json:"-" gorm:"size:100;not null"`
    Email    string `json:"email" gorm:"size:100;not null;unique"`
    Role     string `json:"role" gorm:"size:20;default:'user'"`
    Status   string `json:"status" gorm:"size:20;default:'active'"`
} 