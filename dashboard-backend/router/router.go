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
	router.GET("/notas-enem", controller.GetNotasEnem)
	router.GET("/municipios", controller.GetMunicipios)

	router.Run("localhost:8080")
}
