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
		Model(&models.Despesa{}).
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

func GetMediasEnemParaiba(c *gin.Context) {
	var indicador []models.MediaEnemAgrupadaMunicipio

	result := db.DB.
		Model(&models.MediaEnemAgrupadaMunicipio{}).
		Select(`
			ano,
			AVG(media_geral) AS media_geral,
			AVG(media_cn) AS media_cn,
			AVG(media_ch) AS media_ch,
			AVG(media_lc) AS media_lc,
			AVG(media_mt) AS media_mt,
			AVG(media_red) AS media_red
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
