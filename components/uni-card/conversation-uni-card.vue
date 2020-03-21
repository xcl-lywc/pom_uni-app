<template>
	<view class="uni-card" :class="isFull === true || isFull === 'true' ? 'uni-card--full' : ''" @click="onClick">
		<view :class="{'uni-card__header':true,'uni-card-pad30':isFull === true}" v-if="title">
			<view class="uni-card__header-extra-img-view" v-if="thumbnail">
				<image class="uni-card__header-extra-img" :src="thumbnail"></image>
			</view>
			<view :class="{'uni-card__header-title-text':true,'mix-title-class':mixTitle === true}">
				<fa-icon v-if="mixTitle === true" type="calendar-check-o" size="20" color="#666" class="uni-marr-10"></fa-icon>
				{{title}}
			</view>
			<view class="uni-card__header-extra-text" v-if="extra">{{extra}}</view>
		</view>
		<view :class="{'uni-card__content':true,'uni-card__content--pd':true,'uni-card-pad30':isFull === true}">
				<view><text>谈话时间：{{ beginTime}} ~ {{endTime}}</text></view>
			<view v-if="initiatores">
				<text>谈话人： </text>
				<text v-for="itemChild in initiatores" :key="itemChild">{{ itemChild.name+' ' }}</text>
			</view>
			<view><text>谈话地点：{{ address }}</text></view>
			<view v-if="talkers">
				<text>谈话对象：</text>
				<text v-for="itemChild in talkers" :key="itemChild">{{ itemChild.name+' ' }}</text>
			</view>
			<view class="uni-card__footer border-top-1" style="padding-top: 16upx;margin-top: 16upx;" v-if="bottomInfo">
				<view>
					<uni-icon type="chat" size="16"></uni-icon>
					<text>{{' '+bottomInfo.split('|')[0]}}</text>
				</view>
				<text>{{bottomInfo.split('|')[1]}}</text>
				<text class="">{{bottomInfo.split('|')[2]}}</text>
			</view>
			<view v-if="messageNum">
				<uni-icon type="chat" size="20"></uni-icon>
				<text>{{' '+messageNum}}</text>
			</view>
		</view>
		<view :class="{'uni-card__footer':true,'uni-card-pad30':isFull === true}" v-if="note">{{note}}
			<view v-if="rightNote" class="fr uni-color-666 overflow-hidden">
				<view class="fl"><uni-icon type="person-filled" size="22" class="uni-marr-5"></uni-icon><text class="uni-marr-30">{{rightNote.split("|")[0]}}</text></view>
				<view class="fl" style="margin-top: 2upx;"><fa-icon type="comments" size="18" color="#666" class="uni-marr-10"></fa-icon>{{rightNote.split("|")[1]}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import faIcon from "../kilvn-fa-icon/fa-icon.vue"
	import uniIcon from "@/components/uni-icon/uni-icon.vue" 
	export default {
		components:{faIcon,uniIcon},
		name: "uni-card",
		props: {
			bottomInfo:false,//底部信息
			title: String, //标题
			extra: String, //扩展信息
			note: String, //Tips
			rightNote: String, //rightTips
			beginTime:String,
			endTime:String,
			initiatores:Array,
			address:String,
			talkers:Array,
			messageNum:String,
			thumbnail: String, //缩略图
			isFull: { //内容区域是否通栏
				type: [Boolean, String],
				default: false
			},
			mixTitle: { //小标题
				type: [Boolean, String],
				default: false
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
    $card-extra-width: 30%;
    $uni-spacing-marign:24upx;
    
	@mixin text-omit {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.uni-card {
		margin-left: 30upx;/* Modify */
		margin-right: 30upx;/* Modify */
		background: $uni-bg-color;
		position: relative;
		display: flex;
		flex-direction: column;

		&:after {
			content: '';
			position: absolute;
			transform-origin: center;
			box-sizing: border-box;
			pointer-events: none;
			top: -50%;
			left: -50%;
			right: -50%;
			bottom: -50%;
			border: 1px solid $uni-border-color;
			border-radius: $uni-border-radius-lg;
			transform: scale(.5);
		}

		&__footer,
		&__header {
			position: relative;
			display: flex;
			flex-direction: row;
			padding: $uni-spacing-col-base;
			align-items: center;
		}
		.uni-card-pad30{
			padding-left: 30upx;
			padding-right: 30upx;
		}
		&__header {
			&:after {
				position: absolute;
				bottom: 0;
				right: 0;
				left: 0;
				height: 1px;
				content: '';
				-webkit-transform: scaleY(.5);
				transform: scaleY(.5);
				background-color: $uni-border-color;
			}

			&-title {
				flex: 1;
				margin-right: $uni-spacing-col-base;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;

				&-text {
					font-size: $uni-font-size-lg;
					flex: 1;
					@include text-omit;
				}
				&-text.mix-title-class{
					font-size: 28upx !important;
					color: #666;
				}
			}

			&-extra {
				&-img-view {
					display: flex;
				}

				&-img {
					height: $uni-img-size-sm;
					width: $uni-img-size-sm;
					margin-right: $uni-spacing-col-base;
				}

				&-text {
					flex: 0 0 auto;
					width: $card-extra-width;
					margin-left: $uni-spacing-col-base;
					font-size: $uni-font-size-base;
					text-align: right;
					@include text-omit;
				}
			}

		}

		&__content {
			&--pd {
				padding: $uni-spacing-col-base;
			}
		}
		&__footer {
			justify-content: space-between;
			color: $uni-text-color-grey;
			font-size: $uni-font-size-sm;
			padding-top: 0;
		}
        &--full{
            margin: 0;
        }
	}

</style>
