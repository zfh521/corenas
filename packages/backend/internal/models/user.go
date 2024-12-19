package models

type User struct {
    Base
    Name     string `json:"name" gorm:"size:100;not null"`
    Email    string `json:"email" gorm:"size:100;not null;unique"`
    Password string `json:"-" gorm:"size:100;not null"`
    Role     string `json:"role" gorm:"size:20;default:'user'"`
    Status   string `json:"status" gorm:"size:20;default:'active'"`
}

type UserCreate struct {
    Name     string `json:"name" binding:"required,min=2,max=100"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}

type UserUpdate struct {
    Name   string `json:"name" binding:"omitempty,min=2,max=100"`
    Email  string `json:"email" binding:"omitempty,email"`
    Status string `json:"status" binding:"omitempty,oneof=active inactive"`
} 