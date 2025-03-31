package controller

import (
	"net/http"

	"rest-go/db"
	"rest-go/models"

	"github.com/gin-gonic/gin"
)

func GetEstadoDespesas(c *gin.Context) {
	var despesas []models.Despesa
	result := db.DB.
		Table("despesa").
		Select(`
			ano,
			SUM(despesa_total) as despesa_total
		`).
		Group("ano").
		Order("ano").
		Scan(&despesas)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, despesas)
}
