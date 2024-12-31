package service

import (
    "context"
    "github.com/zfh521/corenas/internal/modules/auth/models"
)

type AuthService interface {
    Login(ctx context.Context, req models.LoginRequest) (string, error)
    Register(ctx context.Context, req models.RegisterRequest) error
} 