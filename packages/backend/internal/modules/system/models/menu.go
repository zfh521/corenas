package models

import "github.com/zfh521/corenas/internal/common/models"

type Menu struct {
	models.BaseModel
	Name     string `json:"name" gorm:"size:100;not null"`
	Path     string `json:"path" gorm:"size:100;not null"`
	Icon     string `json:"icon" gorm:"size:50"`
	ParentID uint   `json:"parent_id"`
	Sort     int    `json:"sort" gorm:"default:0"`
	Status   string `json:"status" gorm:"size:20;default:'active'"`
}
