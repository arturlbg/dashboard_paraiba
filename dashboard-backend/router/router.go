package router

import (
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
	router.GET("/ideb/indicadores", controller.GetIndicadoresEducacionais)

	router.Run("localhost:8080")
}
