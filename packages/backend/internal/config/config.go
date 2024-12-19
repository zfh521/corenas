package config

type Config struct {
    Address      string
    StaticDir    string
}

func NewConfig() *Config {
    return &Config{
        Address:      ":8080",
        StaticDir:    "./static",
    }
} 