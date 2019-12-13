<template>
    <div class="download-table">
        <ks-el-button type="primary" @click="handleAutoDownLoad">
            {{autoDownloadBtn}}
        </ks-el-button>
        <ks-el-table
            border
            stripe
            :data="downLoadList"
            height="1250"
        >
            <ks-el-table-column
                align="center"
                type="index"
                width="50"
            >
            </ks-el-table-column>
            <ks-el-table-column
                align="center"
                prop="photoId"
                label="photoId"
            >
            </ks-el-table-column>
            <ks-el-table-column
                align="center"
                prop="userName"
                label="用户名"
            >
            </ks-el-table-column>
            <ks-el-table-column
                align="center"
                prop="_state"
                label="当前状态"
                width="100"
            >
                <template slot-scope="scope">
                    <i :class="getStateIconClass(scope)"></i>
                </template>
            </ks-el-table-column>
            <ks-el-table-column
                align="center"
                width="200"
                label="操作"
            >
                <template slot-scope="scope">
                    <ks-el-button
                        round
                        plain
                        size="small"
                        class="retry-btn"
                        :type="getStateBtnType(scope)"
                        :disabled="loadingListLen === limit"
                        :loading="scope.row._state === 'loading'"
                        @click="handleRetry(scope)"
                    >
                        {{getStateBtnText(scope)}}
                    </ks-el-button>
                </template>
            </ks-el-table-column>
        </ks-el-table>
    </div>
</template>

<script>
import { Table, TableColumn, Button } from '@ks/ks-element-ui';
import { STATE } from './const';
import { exportMethod } from './../../service';

export default {
    name: 'download',

    components: {
        KsElTable: Table,
        KsElTableColumn: TableColumn,
        KsElButton: Button,
    },
    props: {
        payLoad: {
            type: Object,
            default: () => ({})
        },
        list: {
            type: Array,
            default: () => []
        },
        // 并发下载量
        limit: {
            type: Number,
            default: 5,
        },
        // 错误视频下载尝试总次数
        errorLimit: {
            type: Number,
            default: 5,
        }
    },
    data() {
        return {
            downLoadList: [],
            loadingList: [], // 正在下载队列
            isAuto: false, // 是否自动下载
        };
    },
    computed: {
        loadingListLen() {
            return this.loadingList.length;
        },
        autoDownloadBtn() {
            return this.isAuto ? '停止自动下载' : '自动下载';
        },
    },
    methods: {
        processList() {
            const downList = this.downLoadList;
            this.list.map(item => {
                const { photoId, userName } = item;
                const has = downList.find(item => item.photoId === photoId);
                if (!has) {
                    this.downLoadList.push({
                        photoId,
                        userName,
                        _state: 'wait', // 默认视频下载状态
                        _errNums: 0, // 下载错误次数
                    });
                } else {
                    const { _state } = has;
                    if (_state === 'error') {
                        has._state = 'wait';
                    }
                }
            });
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
        handleAutoDownLoad() {
            const auto = this.isAuto;
            if (auto) {
                this.isAuto = false;
                return;
            }
            this.isAuto = true;
            this.autoDownLoad();
        },
        async handleRetry(scope) {
            this.addItemToLoadingList(scope.row);
        },
        addItemToLoadingList(item) {
            item._state = 'loading';
            this.loadingList.push(item);
            this.downLoadService(item);
        },
        autoDownLoad() {
            const downList = this.downLoadList;
            const downListLen = this.downLoadList.length;
            let i = 0;
            while (this.loadingListLen < this.limit && i < downListLen) {
                const item = downList[i];
                const _state = item._state;
                const _errNums = item._errNums;
                // 如果error的视频，超过erroLimit限制，则不再下载
                if ((_state === 'wait' || _state === 'error') && _errNums < this.errorLimit ) {
                    if (_state === 'error') {
                        item._errNums = _errNums + 1;
                    }
                    this.addItemToLoadingList(item);
                }
                i++;
            }
        },
        async downLoadService(item) {
            item._state = await exportMethod();
            const index = this.loadingList.findIndex(wait => wait.photoId === item.photoId);
            this.loadingList.splice(index, 1);
            if (this.isAuto) {
                this.autoDownLoad();
            }
            // loadingList 长度为0，无待下载列表，自动下载标识设为false
            if (this.loadingListLen === 0) {
                this.isAuto = false;
            }
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
