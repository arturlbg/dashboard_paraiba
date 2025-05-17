package db

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConectarDB() {
	//dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=require TimeZone=America/Sao_Paulo",
	//	"dpg-cvs5r249c44c739q3m30-a",
	//	"arturgurjao",
	//	"B91i0iB4eiqKiWTDtmrfTLbKV8EDm5hV",
	//	"dashboard_5ya7",
	//	5432,
	//)

	dsn := "host=localhost user=postgres password=12345 dbname=dashboard port=5432 sslmode=disable TimeZone=America/Sao_Paulo"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Erro ao conectar ao banco:", err)
	}

	fmt.Println("✅ Conectado ao PostgreSQL com sucesso!")
}
