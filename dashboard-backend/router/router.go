package router

import (
	"fmt"
	"log"
	"os"
	"rest-go/controller"
	"rest-go/middleware"

	"github.com/gin-gonic/gin"
)

func StartRouter() {
	router := gin.Default()

	router.Use(middleware.CorsMiddleware())

	router.GET("/municipios", controller.GetMunicipios)
	router.GET("/municipios/despesas", controller.GetMunicipiosDespesas)
	router.GET("/enem/notas", controller.GetNotasEnem)
	router.GET("/enem/medias", controller.GetMediasEnemAgrupadaMunicipio)
	router.GET("/municipios/ideb/indicadores", controller.GetIndicadoresEducacionais)
	router.GET("/estados/ideb/indicadores", controller.GetIndicadorEducacionalParaiba)
	router.GET("/estados/despesas", controller.GetEstadoDespesas)
	router.GET("/enem/medias/estados", controller.GetMediasEnemParaiba)

	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Tentando iniciar o servidor Gin em %s", addr) // Adicione este log
	err := router.Run(addr)
	if err != nil {
		// Este log talvez não apareça se o Render matar o processo antes
		log.Fatalf("Erro fatal ao iniciar o servidor Gin em %s: %v", addr, err)
	}

	fmt.Printf("Servidor Go rodando em %s\n", addr)
}
