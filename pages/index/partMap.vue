<template>
	<view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map style="width: 100%;height: 1300upx;" :latitude="latitude" :longitude="longitude" :markers="covers">
				</map>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '党建地图',
				latitude: 30.63023,
				longitude: 104.076607,
				
				covers: [{
					latitude: 30.63023,
					longitude: 104.076607,
					iconPath: '../../static/location.png'
				}, {
					latitude: 30.63023,
					longitude: 104.076607,
					iconPath: '../../static/location.png'
				}]
			};
		}
	}
</script>

<style>

</style>
