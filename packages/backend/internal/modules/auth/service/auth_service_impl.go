package service

import (
	"context"
	"errors"
	commonModels "github.com/zfh521/corenas/internal/common/models"
	"github.com/zfh521/corenas/internal/modules/auth/models"
	"gorm.io/gorm"
	"os/exec"
	"strings"
)

type authService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) AuthService {
	return &authService{
		db: db,
	}
}

// checkSystemUser 检查系统用户是否存在
func (s *authService) checkSystemUser(username string) (bool, error) {
	// 方法1：使用 getent 命令
	cmd := exec.Command("getent", "passwd", username)
	if err := cmd.Run(); err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok && exitErr.ExitCode() == 2 {
			return false, nil // 用户不存在
		}
		return false, err // 其他错误
	}
	return true, nil

	// 方法2：直接读取 /etc/passwd
	/*
		file, err := os.Open("/etc/passwd")
		if err != nil {
			return false, err
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := scanner.Text()
			fields := strings.Split(line, ":")
			if len(fields) > 0 && fields[0] == username {
				return true, nil
			}
		}
		return false, scanner.Err()
	*/
}

// validatePassword 验证用户密码
func (s *authService) validatePassword(username, password string) error {
	// 使用 passwd 命令检查账户状态
	statusCmd := exec.Command("passwd", "-S", username)
	output, err := statusCmd.CombinedOutput()
	if err != nil {
		return errors.New("failed to check account status")
	}

	// 检查账户是否被锁定
	if strings.Contains(string(output), "L") || strings.Contains(string(output), "LK") {
		return errors.New("account is locked")
	}

	// 使用 chpasswd 验证密码
	cmd := exec.Command("chpasswd", "-s")
	cmd.Stdin = strings.NewReader(username + ":" + password)
	if err := cmd.Run(); err == nil {
		return nil
	}

	return errors.New("invalid credentials")
}

func (s *authService) Login(ctx context.Context, req models.LoginRequest) (string, error) {
	// 检查用户是否存在
	exists, err := s.checkSystemUser(req.Username)
	if err != nil {
		return "", err
	}
	if !exists {
		return "", errors.New("user not found")
	}

	// 验证密码
	if err := s.validatePassword(req.Username, req.Password); err != nil {
		return "", err
	}

	// 获取用户信息
	cmd := exec.Command("id", "-Gn", req.Username)
	groupsOutput, err := cmd.Output()
	if err != nil {
		return "", errors.New("failed to get user groups")
	}

	groups := strings.Fields(string(groupsOutput))

	// 检查用户是否属于允许登录的组
	isAllowed := false
	for _, group := range groups {
		if group == "sudo" || group == "wheel" || group == "admin" {
			isAllowed = true
			break
		}
	}

	if !isAllowed {
		return "", errors.New("user not authorized")
	}

	// TODO: 生成 JWT token，包含用户信息和组信息
	return "dummy-token", nil
}

func (s *authService) Register(ctx context.Context, req models.RegisterRequest) error {
	user := &commonModels.User{
		Username: req.Username,
		Email:    req.Email,
		Password: req.Password, // TODO: 实际使用时需要对密码进行加密
	}

	// 检查用户名是否已存在
	var count int64
	if err := s.db.Model(&commonModels.User{}).Where("username = ?", user.Username).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return errors.New("username already exists")
	}

	// 检查邮箱是否已存在
	if err := s.db.Model(&commonModels.User{}).Where("email = ?", user.Email).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return errors.New("email already exists")
	}

	// 创建用户
	return s.db.Create(user).Error
}
