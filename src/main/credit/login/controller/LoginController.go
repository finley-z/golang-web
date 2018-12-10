package controller

import (
	"net/http"
	"main/credit/common"
	"html/template"
	"main/credit/core"
	"main/credit/components/logger"
	"strings"
	"main/credit/register/model"
)

func loginIndex(w http.ResponseWriter, r *http.Request) {
	session := common.Session.GetSession(w, r)
	user := session.Get("user-slot")
	if user != nil {
		http.Redirect(w, r, "/main.html", http.StatusFound)

	} else {
		t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/login.html", common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/header.html", common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/footer.html")
		if err != nil {
			logger.Error("parse template error:" + err.Error())
			return
		}
		t.Execute(w, nil)
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	var user *model.UserInfo = new(model.UserInfo)

	r.ParseForm()
	userName := r.Form["username"][0]
	password := r.Form["password"][0]
	user.UserName = userName
	user.Password = password

	logger.Info("user login username=", userName, ",password=", password)
	//pwd:=util.EncryptSHA256(password)
	//success := dao.Insert(user)
	if strings.EqualFold(userName, "") {
		t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/login.html", common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/header.html", common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/footer.html")
		if err != nil {
			logger.Error("parse template error:" + err.Error())
			return
		}

		t.Execute(w, user)
	} else {
		session := common.Session.GetSession(w, r)
		session.Set("user-slot", user)
		http.Redirect(w, r, "/main.html", http.StatusMovedPermanently)
	}

}

func logout(w http.ResponseWriter, r *http.Request) {
	session := common.Session.GetSession(w, r)
	session.Remove("user-slot");
	http.Redirect(w, r, "/login.html", http.StatusMovedPermanently)

}

func init() {
	//fmt.Println("start register login controller!")
	core.RegisterFunc("/login.html", loginIndex)
	core.RegisterFunc("/login.do", login)
	core.RegisterFunc("/logout.do", logout)
	//fmt.Println("login controller register success!")
}
