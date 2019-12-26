<template>
    <div>
        <el-badge
            class="down-btn"
            v-show="showBtn"
            :value="badgeText"
            type="success"
        >
            <el-button
                type="primary"
                icon="el-icon-download"
                circle
                @click="showDrawer = true"
            >
            </el-button>
        </el-badge>
        <el-drawer
            :show-close="false"
            :with-header="false"
            :visible.sync="showDrawer"
            @close="handleClose"
            custom-class="download-drawer"
        >
            <base-down-load
                main-key="photoId"
                :list="list"
                :table-config="TABLE_CONFIG"
                :getUrlFunc="getVideoDataUrl"
                :all-sum.sync="sum"
                :success-sum.sync="successSum"
            ></base-down-load>
        </el-drawer>
    </div>
</template>

<script>
import BaseDownLoad from './index';
import {
    KEY_ERROR,
    TABLE_CONFIG,
} from './const';
export default {
    name: 'download-drawer',
    components: {
        BaseDownLoad,
    },
    props: {
        showBtn: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Boolean,
            default: false,
        },
        payLoad: {
            type: Object,
            default: () => ({})
        },
        list: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            sum: 0,
            successSum: 0,
            showDrawer: this.value,
        };
    },
    created() {
        this.TABLE_CONFIG = TABLE_CONFIG;
    },
    computed: {
        badgeText() {
            return `${this.successSum}/${this.sum}`;
        },
    },
    methods: {
        handleClose() {
            this.$emit('input', false);
        },
        async getVideoDataUrl(item) {
            // 此接口只是获取视频的下载url
            try {
                // 通过接口，获取MP4下载地址
                const { data } = { data: { url: '123'}};
                const { url } = data;
                if (url) {
                    item._url = url;
                } else {
                    item._state = KEY_ERROR;
                }
            } catch (e) {
                item._state = KEY_ERROR;
            }
        },
    },
    watch: {
        value(newVal) {
            this.showDrawer = newVal;
        },
    },
};
</script>
<style scoped lang="less">
.down-btn{
    position: fixed;
    right: 50px;
    bottom: 20px;
}
</style>
<style lang="less">
.download-drawer {
    /deep/ .el-drawer__header {
        height: 0;
        margin: 0;
        padding: 0;
    }
}
</style>
