import axios from "axios";
import { startLoading, endLoading } from "../common/Loading";
export function request(config) {
	const instance = axios.create({
		// baseURL:'/api',
		// baseURL:'https://autumnfish.cn/',
		baseURL: "http://localhost:3000",
		timeout: 30000,
		withCredentials: true,
	});

	// 请求拦截
	instance.interceptors.request.use(
		config => {
			console.log(config);
			if (config.url != "/login/qr/check") {
				startLoading();
			}
			return config;
		},
		error => {
			return Promise.reject(error);
		}
	);

	// 响应拦截
	instance.interceptors.response.use(
		response => {
			endLoading();
			return response;
		},
		error => {
			endLoading();
			return Promise.reject(error);
		}
	);
	instance.defaults.withCredentials = true;
	return instance(config);
}
