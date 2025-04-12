package main

import (
	"log"
	"rest-go/db"
	"rest-go/router"
)

func main() {
	db.ConectarDB()

	if db.DB == nil {
		log.Fatal("Erro fatal: Conexão com o banco de dados falhou!")
	}

	log.Println("Conexão com DB (aparentemente) OK. Iniciando roteador...")
	router.StartRouter()
}
