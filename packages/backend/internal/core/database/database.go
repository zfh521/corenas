package database

import (
    "fmt"
    "github.com/zfh521/corenas/internal/config"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

func Init(cfg config.DatabaseConfig) *gorm.DB {
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        cfg.Username,
        cfg.Password,
        cfg.Host,
        cfg.Port,
        cfg.Database,
    )

    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }

    return db
} 