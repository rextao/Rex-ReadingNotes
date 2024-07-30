<template>
    <element-upload
        :class="['file-uploader', !bucket?.length ? 'disable-uploader' : '', state.fileList.length === 0 ? '' : 'uploaded']"
        :on-success="onAvatarSuccess"
        :on-change="onChange"
        :on-remove="onRemove"
        :on-error="onError"
        :before-upload="onBeforeAvatarUpload"
        :disabled="depend && !bucket?.length"
        :action="depend ? `${uploadApi}?bucket=${bucket}` : `${uploadApi}`"
        :accept="acceptKind"
        :file-list="state.fileList"
        multiple
        drag>
        <i class="sys-icon-add avatar-uploader-icon"></i>
        <div class="title">点击或拖入文件上传</div>
        <div class="sub-title">
            <k18n v-if="desc">{{ desc }}</k18n>
            <template v-else>
                <k18n>文件不超过</k18n><span>{{ limitText }}</span>
                <k18n v-if="otherTip">{{ otherTip }}</k18n>
            </template>
        </div>
        <div class="sub-title">
            <k18n v-if="depend && !bucket?.length">请先指定桶</k18n>
        </div>
    </element-upload>
</template>

<script lang="ts" setup>
import { defineComponent, ref, reactive, toRefs, computed } from 'vue';
import { Message, ImageViewer } from 'element';

const props = defineProps({
    imageUrl: String,
    imageName: String,
    bucket: String,
    acceptKind: String,
    otherTip: String,
    disabled: Boolean,
    limit: {
        type: [Number, String],
        default: 2 * 1024 * 1024,
    },
    uploadApi: {
        type: String,
        default: '/api/noah/resource/file/upload',
    },
    desc: {
        type: String,
        default: '',
    },
    depend: {
        type: Boolean,
        default: true,
    },
    dataKey: {
        type: String,
        default: 'imageUrl',
    },
});
const emits = defineEmits(['onAvatarSuccess', 'onDeleteImage']);
const state = reactive({
    fileList: props.imageUrl ? [{ name: props.imageName || props.imageUrl, url: props.imageUrl }] : [],
});
const onAvatarSuccess = (res: { data: { imageUrl?: string }; message?: string }, files: { raw: string }, fileList) => {
    if (res?.data?.[props.dataKey]) {
        emits('onAvatarSuccess', res?.data?.[props.dataKey]);
    } else {
        Message.error({
            message: res?.message,
            type: 'error',
        });
    }
};
const limitText = computed(() => {
    if (props.limit < 1024) {
        return `${props.limit}B`;
    }
    if (props.limit < 1024 * 1024) {
        return `${props.limit / 1024}KB`;
    }
    return `${props.limit / 1024 / 1024}MB`;
});
const onBeforeAvatarUpload = (file: { type: string; size: number }) => {
    if (props.limit === 'any') return true;
    const isLimit = file.size < props.limit;
    if (!isLimit) {
        Message.error({
            type: 'error',
            message: `上传文件大小不能超过${limitText.value}`,
        });
    }

    return isLimit;
};
const onChange = (file, files) => {
    state.fileList = files;
};
const onRemove = (file, files) => {
    state.fileList = files;
    emits('onDeleteImage');
};
const onError = function (err, file, fileList) {
    Message.error({
        type: 'error',
        message: 'Upload File Error',
    });
};
</script>

<style lang="scss" scoped>
.disable-uploader {
    &:deep(.element-upload-dragger) {
        background-color: #f9f9f9;
    }
}

.file-uploader {
    :deep(.element-upload) {
        width: 100%;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: block;

        .element-upload-dragger {
            width: 100%;
            height: 196px;
            .avatar-uploader-icon {
                font-size: 56px;
                color: #8c939d;
                text-align: center;
                margin-top: 50px;
                display: block;
                span {
                    font-size: 14px;
                    display: block;
                }
            }
        }
    }
}
.uploaded {
    :deep(.element-upload) {
        display: none;
    }
}
.title {
    height: 22px;
    font-size: 14px;
    color: #333333;
    line-height: 22px;
    margin-top: 12px;
}
.sub-title {
    font-size: 12px;
    text-align: CENTER;
    color: #999999;
    line-height: 18px;
    padding-top: 4px;
}
</style>
