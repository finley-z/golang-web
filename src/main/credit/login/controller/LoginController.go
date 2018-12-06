package controller

import (
	"net/http"
	"main/credit/common"
	"html/template"
	"main/credit/core"
	"main/credit/components/logger"
)

func login(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/login.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/header.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/footer.html")
	if err != nil {
		logger.Error("parse template error:"+ err.Error())
		return
	}
	t.Execute(w, nil)
}


func init()  {
	//fmt.Println("start register login controller!")
	core.RegisterFunc("/login.html",login)
	//fmt.Println("login controller register success!")
}