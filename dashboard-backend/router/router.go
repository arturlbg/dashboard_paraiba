package router

import (
	"fmt"
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
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	err := router.Run(addr)
	if err != nil {
		fmt.Println("Erro ao iniciar o servidor:", err)
		os.Exit(1)
	}

	fmt.Printf("Servidor Go rodando em %s\n", addr)
}
