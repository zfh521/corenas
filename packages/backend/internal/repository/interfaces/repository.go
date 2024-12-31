package interfaces

import (
    "context"
)

type Repository interface {
    // 定义通用的仓储接口方法
    Create(ctx context.Context, entity interface{}) error
    Update(ctx context.Context, entity interface{}) error
    Delete(ctx context.Context, id interface{}) error
    FindByID(ctx context.Context, id interface{}, result interface{}) error
} 