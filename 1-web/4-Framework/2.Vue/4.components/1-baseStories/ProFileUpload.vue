<template>
    <div class="pro_file_upload__wrapper">
        <element-upload
            v-show="state.fileList.length === 0"
            ref="upload-file"
            drag
            v-bind="bindProps"
            :on-success="handleUploadSuccess"
            :before-upload="beforeFileUpload"
            :file-list="state.fileList"
            :on-error="handleError"
            :on-remove="handleUploadRemove">
            <div v-loading="state.loading" class="upload_box">
                <i class="element-icon-plus"></i>
                <k18n block class="upload-title">点击此处或将文件拖拽到此处进行上传</k18n>
                <div><k18n class="upload-tip">只支持</k18n>{{ bindProps.accept }}</div>
            </div>
        </element-upload>
        <div v-show="state.fileList.length" class="upload_box finish">
            <div class="finish__content">
                <img class="finish__content__delimg" :src="deleteImg" alt="" @click="handleUploadRemove" />
                <img class="finish__content__iconimg" :src="excelIcon" alt="" />
                <span class="finish__content__name">{{ uploadedFile?.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, reactive, useAttrs } from 'vue';
import { Message } from 'element';
import { get } from 'lodash';
import { elFormEvents, ElFormItemContext, elFormItemKey } from 'element/lib/element-form';
import { uploadFileForAdmin } from '@/components/proUtils/services';

import deleteImg from './imgs/delete.png';
import excelIcon from './imgs/excel-icon.png';
import { getK18n } from '@/components/proUtils/get';

const $k18n = getK18n();
const elFormItem = inject(elFormItemKey, {} as ElFormItemContext);

const DEFAULT_PROPS = {
    'max-size': 100 * 1024 * 1024,
    accept: '.xlsx',
    action: uploadFileForAdmin,
    'show-file-list': false,
};

const attrs = useAttrs();
const props = defineProps({
    limit: {
        type: Number,
        default: 0,
    },
    // 上传成功后，后端返回数据，视频地址的key
    urlKey: {
        type: String,
        default: 'key',
    },
    // 最大尺寸,单位M
    maxSize: {
        type: [String, Number],
        default: '',
    },
});
const emit = defineEmits(['update:modelValue', 'change']);

// default
const bindProps = computed(() => {
    const { limit } = props;
    return {
        limit,
        multiple: limit > 1,
        ...DEFAULT_PROPS,
        ...attrs,
    };
});
const uploadedFile = computed<any>(() => get(state.fileList, '0', undefined));

const beforeFileUpload = (file: any) => {
    const maxSize = Number.parseFloat(props.maxSize);
    if (maxSize) {
        // 大小限制
        const isSize = file.size / 1024 / 1024 < maxSize;
        if (!isSize) {
            Message.error(`${$k18n('文件大小不超过')}${maxSize}M`);
            return false;
        }
    }
    const fileType = file.name.slice(file.name.lastIndexOf('.'));
    if (!bindProps.value.accept?.split(',').includes(fileType)) {
        Message.error($k18n('不支持的文件类型'));
        return false;
    }
    state.loading = true;
};
const state = reactive({
    fileList: [],
    fileKey: '',
    loading: false,
});
const handleUploadSuccess = (response: any, file, fileLis) => {
    if (!response) {
        // 兼容外部通过 http-server 方式上传的情况
        return;
    }
    const { data } = response;
    const { urlKey } = props;
    // 兼容data.url 与 data = 'xxxx'
    const url = data?.[urlKey] ? data?.[urlKey] : data;
    state.fileList = fileLis;
    state.fileKey = url;
    emit('update:modelValue', url);
    elFormItem.formItemMitt?.emit(elFormEvents.formChange, [url]);

    state.loading = false;
};

const handleError = () => {
    Message.error($k18n('上传失败'));
    state.loading = false;
};
const handleUploadRemove = () => {
    state.fileList = [];
    state.fileKey = '';
    state.loading = false;

    elFormItem.formItemMitt?.emit(elFormEvents.formChange, [state.fileKey]);
    emit('update:modelValue', state.fileKey);
};
defineExpose({
    handleUploadRemove,
});
</script>

<style lang="scss" scoped>
.pro_file_upload__wrapper {
    width: 100%;
    height: 100%;
    > div {
        height: 100%;
        width: 100%;
    }
}
:deep(.element-upload) {
    width: 100%;
    height: 100%;
    .element-upload-dragger {
        width: 100%;
        height: 100%;
    }
}

.upload_box {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .element-icon-plus {
        font-size: 56px;
        color: #aeafb2;
    }

    .upload-title {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 4px;
    }

    .upload-tip {
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        text-align: left;
    }
}
.finish {
    background: #f9f9f9;
    display: flex;
    flex-grow: 0;
    justify-content: center;
    align-items: center;
    &__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        &__delimg {
            width: 18px;
            position: relative;
            left: 25px;
            top: 5px;
            cursor: pointer;
        }
        &__iconimg {
            width: 48px;
        }
        &__name {
            width: 280px;
            text-align: center;
            margin-top: 8px;
        }
    }
}
</style>
