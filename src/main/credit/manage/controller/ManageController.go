package controller

import (
	"main/credit/common"
	"html/template"
	"main/credit/core"
	"net/http"
	"main/credit/components/logger"
	"fmt"
)


func mange(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/main.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/m-header.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/m-footer.html")
	if err != nil {
		logger.Error("parse template error:"+ err.Error())
		return
	}
	t.Execute(w, nil)
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	logger.Debug("request url [",r.URL.Path,"]","the remote address is:",r.RemoteAddr)
	if r.URL.Path == "/" {
		http.Redirect(w, r, "/main", http.StatusFound)
	}

	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/error/page-404.html")
	if (err != nil) {
		fmt.Println(err)
	}
	t.Execute(w, nil)
}

func init()  {
	//fmt.Println("start register main controller!")

	core.RegisterFunc("/",NotFoundHandler)
	core.RegisterHandler("/resource/", http.StripPrefix("/resource", http.FileServer(http.Dir(common.AppConf.AppHome+common.AppConf.WebApp.StaticDir))))
	core.RegisterFunc("/main",mange)
	//fmt.Println("main controller register success!")

}