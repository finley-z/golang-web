package controller

import (
	"net/http"
	"main/credit/common"
	"html/template"
	"main/credit/core"
	"main/credit/components/logger"
)

func register(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/register.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/header.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/footer.html")
	if err != nil {
		logger.Error("parse template error:"+ err.Error())
		return
	}
	t.Execute(w, nil)
}

func init()  {
	//fmt.Println("start register register controller!")

	core.RegisterFunc("/register",register)
	//fmt.Println("register controller register success!")

}