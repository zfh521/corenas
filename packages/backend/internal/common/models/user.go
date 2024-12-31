package models

type User struct {
    BaseModel
    Username string `json:"username" gorm:"uniqueIndex;not null"`
    Email    string `json:"email" gorm:"uniqueIndex;not null"`
    Password string `json:"-" gorm:"not null"`
    Role     string `json:"role" gorm:"default:user"`
} 