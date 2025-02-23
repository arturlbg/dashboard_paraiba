package controller

import (
	"net/http"

	"rest-go/db"
	"rest-go/models"

	"github.com/gin-gonic/gin"
)

func GetNotasEnem(c *gin.Context) {
	var notas []models.NotaEnem
	result := db.DB.Find(&notas)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, notas)
}

func GetMediasEnemAgrupadaMunicipio(c *gin.Context) {
	var medias []models.MediaEnemAgrupadaMunicipio
	result := db.DB.Debug().Find(&medias)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, medias)
}
