package util

import (
	"crypto/sha256"
	"main/credit/common"
	"crypto/md5"
	"encoding/hex"
)

func EncryptSHA256(str string) string {
	hash := sha256.New()
	hash.Write([]byte(str))
	secret := hash.Sum([]byte(common.AppConf.PasswordSalt))
	return hex.EncodeToString(secret)
}

func EncryptMD5(str string) string {
	hash := md5.New()
	hash.Write([]byte(str))
	secret := hash.Sum([]byte(common.AppConf.PasswordSalt))
	return hex.EncodeToString(secret)
}