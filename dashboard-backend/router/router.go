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
	router.GET("/municipios/ideb/indicadores", controller.GetIndicadoresEducacionais)
	router.GET("/estados/ideb/indicadores", controller.GetIndicadorEducacionalParaiba)
	router.GET("/estados/despesas", controller.GetEstadoDespesas)

	router.Run("localhost:8080")
}
