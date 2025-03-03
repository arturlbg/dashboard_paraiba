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
