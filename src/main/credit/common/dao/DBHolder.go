package dao

import (
	"database/sql"
	"main/credit/components/logger"
	"main/credit/common"
	//"time"
	_"github.com/go-sql-driver/mysql"
	"time"
)


var dbHolder *sql.DB

func GetDB() *sql.DB {
	return dbHolder
}



func init(){
	logger.Info("init DBHolder the config is :", common.AppConf.DataSource)
	db, err := sql.Open(common.AppConf.DataSource.DriverName,common.AppConf.DataSource.UserName+":"+common.AppConf.DataSource.Password+"@tcp("+common.AppConf.DataSource.HostName+")/"+common.AppConf.DataSource.Database+"?charset=utf8")
	dbHolder=db
	if err!=nil{
		logger.Error("init DBHolder error:"+ err.Error())
	}
	dbHolder.SetMaxIdleConns(10)
	dbHolder.SetMaxOpenConns(1000)
	dbHolder.SetConnMaxLifetime(time.Second*180)
	//fmt.Println("dbholder %v:",DbHolder)

}