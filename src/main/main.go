package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"fmt"
	"html/template"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/hello", sayHello)

	wd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	wd=wd+"/src/main/webapp/resource"
	fmt.Println("dir:",wd)
	mux.Handle("/resource/", http.StripPrefix("/resource", http.FileServer(http.Dir(wd))))
	mux.HandleFunc("/",NotFoundHandler)

	err = http.ListenAndServe(":8080", mux)
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

func sayHello(w http.ResponseWriter, r *http.Request) {

	io.WriteString(w, "Hello world, this is version 1")
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("in ...")
	if r.URL.Path == "/" {
		http.Redirect(w, r, "/hello", http.StatusFound)
	}

	t, err := template.ParseFiles("/Users/finley/Documents/代码管理/golang-web/src/main/webapp/views/error/page-404.html")
	if (err != nil) {
		fmt.Println(err)
	}
	t.Execute(w, nil)

}