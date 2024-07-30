<template>
    <div>
        <Upload
            v-if="!modelValue"
            ref="uploadRef"
            :multiple="false"
            :limit="1"
            drag
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
            :on-error="handleUploadError"
            :on-exceed="handleExceed"
            :on-progress="handleUploadProcess"
            :show-file-list="false"
            v-bind="bindProps">
            <div v-if="!state.percent" class="upload_text__wrapper">
                <IconGeneralAddItem />
                <div v-if="uploadText" class="upload_text">{{ uploadText }}</div>
            </div>
            <Progress v-else class="upload_process" :stroke-width="1" type="circle" :percentage="state.percent" />
        </Upload>
        <div v-else class="hot_video_video__player video_wrapper">
            <IconGeneralCloseCircle v-if="!bindProps.disabled" @click="handleUploadRemove" />
            <VideoPlayer
                ref="playerRef"
                :src="modelValue"
                :need-default-poster="false"
                :control-style="{
                    reverse: false,
                }"
                :config="{
                    volume: true,
                    playbackRate: false,
                    screen: true,
                    play: true,
                }"
                width="100%"
                height="100%" />
        </div>
    </div>
</template>

<script lang="ts" setup>
// 主要提供视频上传样式，上传后，可以观看
import { Upload, Message, Progress } from 'element';
import { computed, reactive, useAttrs, ref } from 'vue';
import { IconGeneralAddItem, IconGeneralCloseCircle } from '@element/pro-icons';
import { VideoPlayer } from '@/index';

const emit = defineEmits(['file-data', 'update:modelValue']);
const attrs = useAttrs();
const props = defineProps({
    // 同步上传成功数据中的url
    modelValue: {
        type: [Object, String],
        default: () => ({}),
    },
    // 上传成功后，后端返回数据，视频地址的key
    urlKey: {
        type: String,
        default: 'url',
    },
    exceedMsg: {
        type: String,
        default: '上传文件数量超限！',
    },
    uploadText: {
        type: String,
        default: '',
    },
    responseCallback: {
        type: Function,
        default: () => {},
    },
    errorCallback: {
        type: Function,
        default: () => {},
    },
    showErrToast: {
        type: Boolean,
        default: true,
    },
});
const uploadRef = ref(null);
const state = reactive({
    percent: 0,
});
const bindProps = computed(() => {
    const { accept } = attrs;
    return {
        accept, // 由于针对视频上传定制，最好只传视频文件
        ...attrs,
    };
});
function handleUploadSuccess(res) {
    if (!res) {
        // 兼容外部通过 http-server 方式上传的情况
        return;
    }
    const { responseCallback } = props;
    const response = res;
    if (responseCallback && typeof responseCallback === 'function') {
        const callbackRes = responseCallback(res);
        if (!callbackRes && typeof callbackRes === 'boolean') {
            uploadRef.value?.clearFiles();
            emit('update:modelValue', '');
            state.percent = 0;
            return;
        }
    }
    const { data } = response;
    // 兼容data.url 与 data = 'xxxx'
    const url = data?.[props.urlKey] || data;
    emit('update:modelValue', url);
    emit('file-data', res.data);
}
function handleExceed() {
    Message.error(props.exceedMsg);
}

function handleUploadError() {
    state.percent = 0;
    if (props.errorCallback) {
        props.errorCallback();
    }
    props.showErrToast && Message.error('上传接口出错！');
}

function handleUploadRemove() {
    state.percent = 0;
    emit('update:modelValue', '');
}
function handleUploadProcess(event) {
    const { percent } = event;
    state.percent = Math.floor(percent);
}
</script>
<style lang="scss" scoped>
:deep(.element-upload-dragger) {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, 0.15);
    width: 146px;
    height: 146px;
    border-radius: 4px;
    line-height: 1;
    color: rgba(255, 255, 255, 0.6);
    &:hover {
    }
}
.upload_text__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon-wrapper {
        color: rgba(0, 0, 0, 0.4);
    }
    .upload_text {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.4);
        margin-top: 9px;
    }
    .element-upload__tip {
        font-size: 12px;
        margin-top: 0;
    }
}
.upload_process {
    :deep(.element-progress__text) {
    }
}
// 上传样式，.element-upload-dragger 默认这个尺寸
.video_wrapper {
    position: relative;
    width: 146px;
    height: 146px;
    background-color: #ebecf0;
    .icon-wrapper {
        top: -10px;
        position: absolute;
        right: -10px;
        color: #8c8c8c;
        cursor: pointer;
        font-size: 20px;
        width: 20px;
        z-index: 1;
    }
}
</style>
