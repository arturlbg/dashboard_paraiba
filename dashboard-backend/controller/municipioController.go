package controller

import (
	"net/http"

	"rest-go/db"
	"rest-go/models"

	"github.com/gin-gonic/gin"
)

func GetMunicipios(c *gin.Context) {
	var municipios []models.Municipio
	result := db.DB.Find(&municipios)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, municipios)
}

func GetMunicipiosDespesas(c *gin.Context) {
	var despesas []models.Despesa
	result := db.DB.Find(&despesas)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, despesas)
}
