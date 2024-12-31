package config

type Config struct {
    Server   ServerConfig
    Database DatabaseConfig
    Auth     AuthConfig
}

type ServerConfig struct {
    Address string
}

type DatabaseConfig struct {
    Driver   string
    Host     string
    Port     int
    Username string
    Password string
    Database string
}

type AuthConfig struct {
	AllowedGroups []string `yaml:"allowed_groups"`
	TokenSecret   string   `yaml:"token_secret"`
	TokenExpiry   int      `yaml:"token_expiry"` // 以小时为单位
}

func Load() *Config {
    // 这里可以从环境变量或配置文件加载配置
    return &Config{
        Server: ServerConfig{
            Address: ":9101",
        },
        Database: DatabaseConfig{
            Driver:   "mysql",
            Host:     "localhost",
            Port:     3306,
            Username: "root",
            Password: "admin123",
            Database: "corenas",
        },
        Auth: AuthConfig{
            AllowedGroups: []string{"sudo", "wheel", "admin"},
            TokenSecret:   "your-secret-key",
            TokenExpiry:   24,
        },
    }
} 