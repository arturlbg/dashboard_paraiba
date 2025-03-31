package controller

import (
	"net/http"

	"rest-go/db"
	"rest-go/models"

	"github.com/gin-gonic/gin"
)

func GetIndicadoresEducacionais(c *gin.Context) {
	var indicadores []models.IdebEscolas
	result := db.DB.Find(&indicadores)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, indicadores)
}

func GetIndicadorEducacionalParaiba(c *gin.Context) {
	var indicador []models.IdebEscolas

	result := db.DB.
		Table("ideb_escolas").
		Select(`
			ano,
			AVG(ideb) AS ideb,
			AVG(fluxo) AS fluxo,
			AVG(nota_mt) AS nota_mt,
			AVG(nota_lp) AS nota_lp
		`).
		Group("ano").
		Order("ano").
		Scan(&indicador)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, indicador)
}
