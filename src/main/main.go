package main

import (
	"main/credit/core"
	_"main/credit/manage/controller"
	_"main/credit/login/controller"
	_"main/credit/register/controller"
	"main/credit/components/logger"
	"main/credit/common"
)

func main() {
	logger.Info("application ",common.AppConf.AppName,"starting... ")
	core.Start()
	logger.Info("application ",common.AppConf.AppName,"start success! ")
}