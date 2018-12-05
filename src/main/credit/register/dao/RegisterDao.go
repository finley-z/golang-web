package dao

import (
	"main/credit/register/model"
	"main/credit/common/dao"
	"main/credit/components/logger"
)

func  Insert(info *model.UserInfo) bool  {
	db:= dao.GetDB()

	logger.Info("insert into crm_user (user_name,gender,real_name,password,email,phone) values(?,?,?,?,?,?)")

	stmt,err:=db.Prepare("insert into crm_user (user_name,gender,real_name,password,email,phone) values(?,?,?,?,?,?)")
	if err!=nil{
		logger.Error("insert  error:"+ err.Error())
		return false
	}
	stmt.Exec(info.UserName,info.Gender,info.RealName,info.Password,info.Email,info.Mobile)
	if err!=nil{
		logger.Error("insert  error:"+ err.Error())
		return false
	}
	defer  stmt.Close()
	return true
}
