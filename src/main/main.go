package main

import (
	"log"
	"net/http"
	"fmt"
	"html/template"
	"main/credit/common"

)

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("/login", login)
	mux.HandleFunc("/register", register)
	mux.HandleFunc("/main", mange)
	mux.Handle("/resource/", http.StripPrefix("/resource", http.FileServer(http.Dir(common.AppConf.AppHome+common.AppConf.WebApp.StaticDir))))
	mux.HandleFunc("/",NotFoundHandler)

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal(err)
	}

}

type appHandler func(http.ResponseWriter, *http.Request) error

func (fn appHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := fn(w, r); err != nil {
		http.Error(w, err.Error(), 500)
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/login.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/header.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/footer.html")
	if err != nil {
		fmt.Fprintf(w, "parse template error: %s", err.Error())
		return
	}
	t.Execute(w, nil)
}

func register(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/register.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/header.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/footer.html")
	if err != nil {
		fmt.Fprintf(w, "parse template error: %s", err.Error())
		return
	}
	t.Execute(w, nil)
}

func mange(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/main.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/m-header.html",common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/m-footer.html")
	if err != nil {
		fmt.Fprintf(w, "parse template error: %s", err.Error())
		return
	}
	t.Execute(w, nil)
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		http.Redirect(w, r, "/hello", http.StatusFound)
	}

	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/error/page-404.html")
	if (err != nil) {
		fmt.Println(err)
	}
	t.Execute(w, nil)
}