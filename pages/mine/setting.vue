<template>
	<view>
		<uni-list>
			<uni-list-item title="退出登录" @click="itemClick('logout')"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import {
		Logout
	} from "../../comm/api.js"
	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {

			};
		},
		methods:{
			itemClick(e){
				if(e == "logout"){
					Logout(function success(){
						uni.reLaunch({
							url: '/components/Login'
						});
					});
					uni.reLaunch({
						url: '/components/Login'
					});
				}
			}
		}
	}
</script>

<style>

</style>
