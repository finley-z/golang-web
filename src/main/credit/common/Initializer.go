package common

import (
	"os"
	"encoding/json"
	"main/credit/components/logger"
	"main/credit/common/conf"
)



var AppConf conf.AppConfig

func init()  {
	AppHome, err := os.Getwd()

	// 通过配置文件配置
	logger.SetLogger(AppHome+"/src/main/resource/log.json")

	//打开配置文件
	file, err:= os.Open(AppHome+"/src/main/resource/conf.json")
	defer file.Close()

	if err!=nil{
		logger.Info("Open Config File Fail,",err)
	}

	//将配置文件解析成JSON对象
	decoder := json.NewDecoder(file)
	decerr := decoder.Decode(&AppConf)

	if decerr != nil {
		logger.Info("Decoder The Config File Fail,", decerr)
	}
}