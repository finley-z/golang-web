package core

import (
	"net/http"
	"log"
	"main/credit/common"
	"main/credit/components/logger"
)


//路由配置器
var mux *http.ServeMux

/**
	服务启动
 */
func Start()  {
	//服务启动
	port:=common.AppConf.ServerPort;
	logger.Info("server starting.... , the port is:",port)
	err := http.ListenAndServe(port, mux)
	if err != nil {
		log.Fatal(err)
	}
	logger.Info("server start success!")
	//启动日志打印
}

/**
 	服务停止
 */
func Stop()  {

}


/**
	控制器注册入口
 */
func RegisterFunc(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	logger.Info("attempt register the controller[",pattern,"]")
	mux.HandleFunc(pattern, handler)
	logger.Info("the controller ",pattern," register success !")
}

/**
	控制器注册入口
 */
func RegisterHandler(pattern string, handler http.Handler) {
	logger.Info("attempt register the controller[",pattern,"]")
	mux.Handle(pattern, handler)
	logger.Info("the controller ",pattern," register success !")
}

func init()  {
	mux = http.NewServeMux()
	logger.Info("init serveMux success !")
}