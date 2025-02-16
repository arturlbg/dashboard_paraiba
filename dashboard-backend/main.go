package main

import (
	"log"
	"rest-go/db"
	"rest-go/router"
)

func main() {
	db.ConectarDB()

	// Verifica se a conexão foi bem-sucedida
	if db.DB == nil {
		log.Fatal("Erro fatal: Conexão com o banco de dados falhou!")
	}

	router.StartRouter()
}
