package controller

import (
	"net/http"
	"main/credit/common"
	"html/template"
	"main/credit/core"
	"main/credit/components/logger"
	"main/credit/register/model"
	"main/credit/register/dao"
	"io"
	model2 "main/credit/common/model"
	"encoding/json"
	"main/credit/common/util"
)

func registerIndex(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles(common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/register.html", common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/header.html", common.AppConf.AppHome+common.AppConf.WebApp.TemplateDir+"/template/footer.html")
	if err != nil {
		logger.Error("parse template error:" + err.Error())
		return
	}
	t.Execute(w, nil)

}

func register(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	var user *model.UserInfo = new(model.UserInfo)
	user.UserName = r.Form["username"][0]
	user.Password = r.Form["password"][0]
	user.RePassword = r.Form["repassword"][0]
	user.RealName ="郑远锋"
	user.Gender = 1
	user.Email = "573108440@qq.com"
	user.Mobile = "13027236862"

	pwd:=util.EncryptSHA256(user.Password)
	user.Password = pwd
	success := dao.Insert(user)
	res:=model2.Result{success,"success",nil}
	buf,_:=json.Marshal(res)
	io.WriteString(w,string(buf))
}

func init() {
	//fmt.Println("start register register controller!")
	core.RegisterFunc("/register.html", registerIndex)
	core.RegisterFunc("/register", register)
	//fmt.Println("register controller register success!")

}
