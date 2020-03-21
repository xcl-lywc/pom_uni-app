<template>
	<view class="s-page-wrapper is-100vh">
		<view class="is-33vh has-mgt-10">
			<view class="is-flex is-column is-justify-center  is-align-center is-height-100">
				<image src="../static/logo.png" mode="aspectFit" class="logoimg"></image>
			</view>
		</view>
		<view class="content">
			<view class="has-mglr-10 ">
				<view class=" has-mgtb-10 ">
					<input type="text" required v-model="login.username" placeholder="请输入用户名" class="is-input1 " @input="BindInput"
					 data-val="username" />
				</view>
				<view class=" has-radius has-mgtb-10">
					<input type="password" v-model="login.password" required placeholder="请输入密码" class="is-input1" @input="BindInput"
					 data-val="password" />
				</view>
				<view class=" loginbtn has-radius has-mgtb-20">
					<button :loading="login.loading" @tap="defaultHandlerLogin"> {{ login.loading ? "登录中...":"登 录"}} </button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Login
	} from "../comm/api.js"
	export default {
		data() {
			return {
				login: {
					loading: false,
					username: "",
					password: ""
				},

			};
		},
		methods: {
			defaultHandlerLogin: function() {
				var self = this;
				if (!self.login.username || !self.login.password) {
					uni.showToast({
						title: '用户名和密码不能为空!',
						duration: 2000,
						mask: true,
						icon: 'none'
					});
					return;
				}
				self.login.loading = true;
				const data = {
					username: self.login.username,
					password: self.login.password
				}
				Login(data, function success(data) { 
					self.login.loading = false;
					uni.setStorage({
						key: 'userInfo',
						data: data,
						success: function() {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}
					});
					
				})
			},
			BindInput: function(e) {
				var dataval = e.currentTarget.dataset.val;
				this.login[dataval] = e.detail.value;
			}
		}
	}
</script>

<style>
	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	.content {
		width: 85%;
		margin: 0 auto;
	}

	.loginbtn button {
		margin-top: 20rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: #ffffff;
		font-size: 32rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: #ff6955;
		opacity: 0.8;
	}

	button:after {
		border: 2rpx solid #f2f2f2;
	}

	.logoimg {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
	}

	.is-input1 {
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		padding: 12rpx;
		padding: 0;
		color: #353535;
		font-size: 32rpx;
		box-sizing: border-box;
		appearance: none;
		border: 2rpx solid #e5e5e5;
		box-shadow: none;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		padding-left: 30rpx;
		margin: 0;
		font-family: inherit;
		background: #fff;
		resize: none;
	}
</style>
