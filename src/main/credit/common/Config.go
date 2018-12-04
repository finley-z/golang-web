package common

import (
	"os"
	"encoding/json"
	"fmt"
)

type WebApp struct {
	TemplateDir string `json:"template_dir"`
	StaticDir string `json:"static_dir"`
}

type DataSource struct {
	DriverName string `json:"driver_name"`
	HostName string `json:"host_name"`
	UserName string `json:"user_name"`
	Password string `json:"password"`
	Database string `json:"database"`
}

type Redis struct {

}

type AppConfig struct {
	 AppName string `json:"app_name"`
	 AppHome string `json:"app_home"`
	 WebApp WebApp `json:"web_app"`
	 DataSource DataSource `json:"data_source"`
	 Redis Redis `json:"redis"`
}

var AppConf AppConfig

func init()  {
	AppHome, err := os.Getwd()

	//打开配置文件
	file, err:= os.Open(AppHome+"/src/main/resource/conf.json")
	defer file.Close()

	if err!=nil{
		fmt.Println("Open Config File Fail,",err)
	}

	//将配置文件解析成JSON对象
	decoder := json.NewDecoder(file)
	decerr := decoder.Decode(&AppConf)

	if decerr != nil {
		fmt.Println("Decoder The Config File Fail,", decerr)
	}
}