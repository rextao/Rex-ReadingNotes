<template>
    <div v-if="imageUrl" :class="uploadImageClass">
        <element-image :src="imageUrl" fit="scale-down" class="upload-image" />
        <div v-if="!imageDisabled" class="hover-image-wrapper">
            <span class="action-icon" @click="previewImage">
                <IconGeneralEye color="#fff" />
            </span>
            <span v-if="!disabled" class="action-icon left-line" @click="deleteImage">
                <IconGeneralDelete color="#fff" />
            </span>
        </div>
    </div>
    <image-viewer
        v-if="preivewVisble"
        :url-list="[imageUrl]"
        :hide-on-click-modal="false"
        :z-index="10000"
        @close="
            () => {
                preivewVisble = false;
            }
        " />

    <element-upload
        v-show="!imageUrl"
        :class="uploadClass"
        :on-success="onAvatarSuccess"
        :before-upload="onBeforeAvatarUpload"
        :disabled="depend && !bucket?.length"
        :action="depend ? `${uploadApi}?bucket=${bucket}` : `${uploadApi}`"
        :show-file-list="false"
        :accept="acceptKind"
        v-bind="$attrs"
        multiple
        drag>
        <i class="sys-icon-add avatar-uploader-icon"></i>
        <template v-if="size !== 'small'">
            <div>
                <k18n v-if="desc">{{ desc }}</k18n>
                <template v-else>
                    <k18n>图片不超过</k18n><span>{{ limitText }}</span>
                    <k18n v-if="otherTip">{{ otherTip }}</k18n>
                </template>
            </div>
            <div v-if="depend">
                <k18n v-if="!bucket?.length">请先指定桶</k18n>
            </div>
        </template>
    </element-upload>
</template>

<script lang="ts" setup>
import { inject, ref, computed } from 'vue';
import { Message, ImageViewer } from 'element';
import { elFormKey, ElFormContext } from 'element/lib/element-form';
import { IconGeneralEye, IconGeneralDelete } from '@element/pro-icons';

const elForm = inject(elFormKey, {} as ElFormContext);
const imageDisabled = computed(() => {
    return elForm.disabled;
});
const props = defineProps({
    imageUrl: String,
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
        default: '/api/noah/resource/file/image/upload',
    },
    desc: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: '',
    },
    depend: {
        type: Boolean,
        default: true,
    },
    dataKey:{
        type:String,
        default:'imageUrl'
    }
});
const emits = defineEmits(['onAvatarSuccess', 'onDeleteImage']);
const uploadClass = computed(() => {
    let className = 'uploader-wrapper';
    if ((props.depend && !props.bucket) || imageDisabled.value) {
        className += ' disable-uploader';
    }
    if (props.size === 'line') {
        className += ' uplpader-line';
    } else if (props.size === 'small') {
        className += ' uplpader-small';
    }
    return className;
});
const uploadImageClass = computed(() => {
    let className = 'upload-image-wrapper';
    if (props.size === 'small') {
        className += ' upload-image-wrapper-small';
    }
    return className;
});
const onAvatarSuccess = (res: { data: { imageUrl: string }; message?: string }, file: { raw: string }) => {
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
            message: `上传图片大小不能超过${limitText.value}`,
        });
    }

    return isLimit;
};
const preivewVisble = ref(false);
const previewImage = () => {
    preivewVisble.value = true;
};
const deleteImage = () => {
    emits('onDeleteImage');
};
</script>

<style lang="scss" scoped>
.upload-image-wrapper {
    display: inline-block;
    margin-right: 10px;
    position: relative;
    &.upload-image-wrapper-small {
        margin-right: 0;
        width: 100px;
        height: 100px;
        :deep(.element-image) {
            min-width: 100%;
            height: 100%;
        }
    }
    :deep(.element-image) {
        min-width: 300px;
        height: 200px;
        border: 1px dashed #d5d6d9;
        border-radius: 4px;
        display: inline-block;
        text-align: center;
    }
    .hover-image-wrapper {
        display: none;
    }
    &:hover {
        .hover-image-wrapper {
            cursor: pointer;
            display: inline-block;
            width: 100%;
            height: 32px;
            position: absolute;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            transition: opacity 0.3s;
            display: flex;
            align-items: center;
            .action-icon {
                flex: 1;
                box-sizing: border-box;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
            }
            .left-line {
                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    width: 0;
                    height: 16px;
                    border-right: 1px solid #ffffff;
                }
            }
        }
    }
}

.disable-uploader {
    &:deep(.element-upload-dragger) {
        background-color: #f9f9f9;
    }
}

.uploader-wrapper {
    color: #8c939d;
    :deep(.element-upload) {
        width: 196px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: block;

        .element-upload-dragger {
            width: 196px;
            height: 196px;
            .avatar-uploader-icon {
                font-size: 40px;
                color: #8c939d;
                width: auto;
                height: auto;

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
.uplpader-line {
    :deep(.element-upload) {
        width: 100%;
        height: 196px;
        .element-upload-dragger {
            width: 100%;
            height: 196px;
        }
    }
}
.uplpader-small {
    :deep(.element-upload) {
        width: 100px;
        height: 100px;
        .element-upload-dragger {
            width: 100%;
            height: 100px;
            .avatar-uploader-icon {
                margin-top: 32px;
            }
        }
    }
}
</style>
