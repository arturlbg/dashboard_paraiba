package router

import (
	"rest-go/controller"
	"rest-go/middleware"

	"github.com/gin-gonic/gin"
)

func StartRouter() {

	router := gin.Default()

	router.Use(middleware.CorsMiddleware())

	router.GET("/despesas", controller.GetDespesas)
	router.GET("/municipios", controller.GetMunicipios)
	router.GET("/enem/notas", controller.GetNotasEnem)
	router.GET("/enem/medias", controller.GetMediasEnemAgrupadaMunicipio)

	router.Run("localhost:8080")
}
