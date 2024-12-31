package interfaces

import (
    "context"
)

type Service interface {
    // 定义通用的服务接口方法
    Create(ctx context.Context, dto interface{}) error
    Update(ctx context.Context, dto interface{}) error
    Delete(ctx context.Context, id interface{}) error
    GetByID(ctx context.Context, id interface{}) (interface{}, error)
} 