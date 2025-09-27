package db

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConectarDB() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=require TimeZone=America/Sao_Paulo",
		"dpg-d3bil137mgec739oacqg-a",
		"dashboard_x4yv_user",
		"t7ifV3v2MXzFOMPRCtFpf8HuOQtX3Q8Q",
		"dashboard_x4yv",
		5432,
	)

	//dsn := "host=localhost user=postgres password=12345 dbname=dashboard port=5432 sslmode=disable TimeZone=America/Sao_Paulo"  #use local

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Erro ao conectar ao banco:", err)
	}

	fmt.Println("✅ Conectado ao PostgreSQL com sucesso!")
}
