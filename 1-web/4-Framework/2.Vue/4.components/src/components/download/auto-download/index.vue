<template>
    <div class="download-table">
        <div class="control">
            <el-button type="primary" @click="handleAutoDownLoad">
                {{autoDownloadBtn}}
            </el-button>
        </div>
        <el-table
            border
            stripe
            :data="downLoadList"
            :height="tableHeight"
        >
            <el-table-column
                align="center"
                type="index"
                width="50"
            >
            </el-table-column>
            <el-table-column
                v-for="item in tableConfig"
                align="center"
                :prop="item.prop"
                :key="item.prop"
                :label="item.label"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="_state"
                label="当前状态"
                width="100"
            >
                <template slot-scope="scope">
                    <i :class="getStateIconClass(scope)"></i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="200"
                label="操作"
            >
                <template slot-scope="scope">
                    <el-button
                        round
                        plain
                        size="small"
                        class="retry-btn"
                        :type="getStateBtnType(scope)"
                        :disabled="loadingListLen === limit"
                        :loading="scope.row._state === KEY_LOADING"
                        @click="handleRetry(scope)"
                    >
                        {{getStateBtnText(scope)}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    STATE,
    KEY_SUCCESS,
    KEY_LOADING,
    KEY_ERROR,
    KEY_WAIT,
} from './const';
const { $http } = window;
import { saveAs } from 'file-saver';

export default {
    name: 'download',
    props: {
        mainKey: {
            type: String,
            default: '',
            require: true
        },
        tableConfig: {
            type: Array,
            default: () => []
        },
        list: {
            type: Array,
            default: () => []
        },
        // 获取url
        getUrlFunc: {
            type: Function,
            default: () => {},
        },
        // 并发下载量
        limit: {
            type: Number,
            default: 5,
        },
        // 错误视频下载尝试次数
        errorLimit: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            downLoadList: [],
            loadingList: [], // 正在下载队列
            isAuto: false, // 是否自动下载
            successNum: 0, // 下载成功
            tableHeight: '',
        };
    },
    created() {
        this.KEY_LOADING = KEY_LOADING;
    },
    mounted() {
        window.addEventListener('beforeunload', this.beforeunloadCallBack);
        this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 80;
        });
    },
    destroyed() {
        window.removeEventListener('beforeunload', this.beforeunloadCallBack);
    },
    computed: {
        loadingListLen() {
            return this.loadingList.length;
        },
        downLoadListLen() {
            return this.downLoadList.length;
        },
        autoDownloadBtn() {
            return this.isAuto ? '停止自动下载' : '自动下载';
        },
    },
    methods: {
        // 数据去重，并添加需要使用的key
        processList() {
            const downList = this.downLoadList;
            const mainKey = this.mainKey;
            this.list.map(item => {
                const keyVal = item[mainKey];
                const has = downList.find(item => item[mainKey] === keyVal);
                if (!has) {
                    this.downLoadList.push({
                        ...item,
                        _state: KEY_WAIT, // 默认视频下载状态
                        _errNums: 0, // 下载错误次数
                        _url: '', // 存储视频下载url
                    });
                    this.$emit('update:all-sum', this.downLoadListLen);
                } else {
                    const { _state } = has;
                    if (_state === KEY_ERROR) {
                        has._state = KEY_WAIT;
                    }
                }
            });
        },
        handleAutoDownLoad() {
            const auto = this.isAuto;
            const downList = this.downLoadList;
            // 如果待下载列表都为success，不再自动下载
            const allSuccess = downList.every(item => item._state === KEY_SUCCESS);
            if (auto || allSuccess) {
                this.isAuto = false;
                return;
            }
            this.isAuto = true;
            this.autoDownLoad();
        },
        async handleRetry(scope) {
            this.addItemToLoadingList(scope.row);
        },
        autoDownLoad() {
            const downList = this.downLoadList;
            const downListLen = this.downLoadList.length;
            let i = 0;
            while (this.loadingListLen < this.limit && i < downListLen) {
                const item = downList[i];
                const _state = item._state;
                const _errNums = item._errNums;
                if (_state === KEY_WAIT) {
                    this.addItemToLoadingList(item);
                }
                // 如果error的视频，超过erroLimit限制，则不再下载
                if (_state === KEY_ERROR && _errNums < this.errorLimit) {
                    item._errNums = _errNums + 1;
                    this.addItemToLoadingList(item);
                }
                i++;
            }
        },
        addItemToLoadingList(item) {
            // 对于已成功下载的，再下载，避免计数错误
            if (item._state === KEY_SUCCESS) {
                this.successNum -= 1;
            }
            item._state = KEY_LOADING;
            this.loadingList.push(item);
            this.downLoadService(item);
        },
        async downLoadService(item) {
            const mainKey = this.mainKey;
            await this.downLoadVideo(item);
            const index = this.loadingList.findIndex(wait => wait[mainKey] === item[mainKey]);
            this.loadingList.splice(index, 1);
            if (this.isAuto) {
                this.autoDownLoad();
            }
            // loadingList 长度为0，无待下载列表，自动下载标识设为false
            if (this.loadingListLen === 0) {
                this.isAuto = false;
            }
        },
        async downLoadVideo(item) {
            // 等待获取item.url
            if (!item._url) {
                await this.getUrlFunc(item);
                item._state = await this.exportVideo(item);
            }
        },
        getStateIconClass(scope) {
            return STATE[scope.row._state].ICON_CLASS;
        },
        getStateBtnText(scope) {
            return STATE[scope.row._state].BTN_TEXT;
        },
        getStateBtnType(scope) {
            return STATE[scope.row._state].BTN_TYPE;
        },
        async exportVideo(item) {
            const mainKey = this.mainKey;
            try {
                const data = await $http.get(
                    item._url,
                    {
                        responseType: 'blob',
                        withCredentials: true,
                        enabledUnversalLoading: false,
                        disableUniversalErrorHandler: true,
                    }
                );
                await saveAs(new Blob([data], {
                    type: 'application/mp4'
                }), `${mainKey}-${item[mainKey]}.mp4`);
                this.successNum += 1;
                this.$emit('update:success-sum', this.successNum);
                return KEY_SUCCESS;
            } catch (e) {
                return KEY_ERROR;
            }
        },
        beforeunloadCallBack(e) {
            const msg = '您可能有数据未下载完！';
            e.returnValue = msg;
            return msg;
        }
    },
    watch: {
        list: {
            deep: true,
            immediate: true,
            handler() {
                this.processList();
            }
        },
    },
};
</script>

<style scoped lang="less">
.download-table {
    // 控制区
    .control {
        margin: 20px;
    }
    .text-danger{
        color: #F56C6C;
    }
    .text-success{
        color: #67C23A;
    }
    .retry-btn{
        min-width: 120px;
    }
}
</style>
