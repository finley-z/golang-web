package conf

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
	ServerPort string `json:"server_port"`
	AppName string `json:"app_name"`
	AppHome string `json:"app_home"`
	WebApp WebApp `json:"web_app"`
	DataSource DataSource `json:"data_source"`
	Redis Redis `json:"redis"`
}