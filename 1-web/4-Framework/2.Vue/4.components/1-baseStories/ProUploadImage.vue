<template>
    <div>
        <element-upload
            ref="uploadRef"
            :class="uploadClass"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            :on-error="handleUploadError"
            :on-remove="handleUploadRemove"
            :on-exceed="handleUploadExceed"
            v-bind="bindProps">
            <template #default>
                <div class="upload_text__wrapper">
                    <IconGeneralAddItem />
                    <div v-if="uploadText" class="upload_text">{{ uploadText }}</div>
                </div>
            </template>

            <template #file="{ file }" class="thumbnail-box">
                <img class="element-upload-list__item-thumbnail" :src="file.url" alt="img" />
                <span class="element-upload-list__item-actions">
                    <!--                    <span class="element-upload-list__item-preview" @click="handlePicturePreview(file)">-->
                    <!--                        <i class="element-icon-zoom-in"></i>-->
                    <!--                    </span>-->
                    <span v-if="!disabled && !isDetail" class="element-upload-list__item-delete" @click="handleClickRemove(file)">
                        <i class="element-icon-delete"></i>
                    </span>
                    <span v-if="isDetail" class="element-upload-list__item-delete" @click="handleClickDownload(file)">
                        <i class="element-icon-download"></i>
                    </span>
                </span>
            </template>
        </element-upload>
        <div class="el-upload__tip">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Upload, Message } from 'element';
import { computed, defineComponent, onMounted, reactive, toRefs, ref, watch, nextTick } from 'vue';
import { IconGeneralAddItem } from '@element/pro-icons';

const STATE = {
    ALL: 'all', // 同时配置宽高
    WIDTH: 'width', // 只配置宽
    HEIGHT: 'height', // 只配置高
    NONE: 'none',
};

// 图片限制逻辑
function limitComposition(props) {
    const limitWidthNum = computed(() => {
        return Number(props.limitWidth);
    });
    const limitHeightNum = computed(() => {
        return Number(props.limitHeight);
    });
    const scaleArr = computed(() => {
        return props.scale.split(':') || [];
    });
    const hasScale = computed(() => {
        return props.scale !== '';
    });
    const getLimitState = computed(() => {
        if (limitWidthNum.value) {
            if (limitHeightNum.value) {
                return STATE.ALL;
            }
            return STATE.WIDTH;
        }
        if (limitHeightNum.value) {
            return STATE.HEIGHT;
        }
        return STATE.NONE;
    });

    function handleBeforeUpload(file) {
        const { limitWidth, limitHeight } = props;
        const maxSize = Number(props.maxSize);
        const img = new Image();
        if (maxSize) {
            // 图片大小限制
            const isSize = file.size / 1024 < maxSize;
            if (!isSize) {
                Message.error(`The uploaded image cannot exceed ${maxSize} kb!`);
                return false;
            }
        }
        if (maxSize === 0 && limitHeight === '' && limitWidth === '') {
            return true;
        }
        return new Promise((resolve, reject) => {
            img.onload = () => {
                const valid = validateImgLimit(img);
                if (valid) {
                    resolve(valid);
                } else {
                    reject();
                }
            };
            img.src = URL.createObjectURL(file);
        }).then(
            () => {
                return file;
            },
            () => {
                const msg = `您上传图片尺寸为：${img.width}*${img.height},${
                    limitWidth && limitHeight ? `但图片尺寸限制为${limitWidth} x ${limitHeight}` : '不符合要求'
                }`;
                Message.error(msg);
                return Promise.reject();
            }
        );
    }
    function validateImgLimit(img) {
        let valid = true;
        const state = getLimitState.value;
        const [scaleW, scaleH] = scaleArr.value;
        let validWidth = true; // 宽度是否符合要求
        let validHeight = true; // 高是否符合要求
        if (props.isMaxLimit) {
            validWidth = img.width <= limitWidthNum.value;
            validHeight = img.height <= limitHeightNum.value;
        } else {
            validWidth = img.width === limitWidthNum.value;
            validHeight = img.height === limitHeightNum.value;
        }
        switch (state) {
            // 同时传入限制宽高
            case STATE.ALL:
                // limitWidth，limitHeight，scale都设置
                if (hasScale.value) {
                    validWidth = img.width <= limitWidthNum.value;
                    validHeight = img.height <= limitHeightNum.value;
                    valid = img.width * scaleH === img.height * scaleW;
                }
                valid = valid && validHeight && validWidth;
                break;
            case STATE.WIDTH:
                valid = validWidth;
                break;
            case STATE.HEIGHT:
                valid = validHeight;
                break;
            case STATE.NONE:
                if (hasScale.value) {
                    valid = img.width * scaleH === img.height * scaleW;
                }
                break;
            default:
                break;
        }
        return valid;
    }
    return {
        limitWidthNum,
        handleBeforeUpload,
    };
}
function downLoadComposition() {
    const state = reactive({
        // 优化下载，用于图片下载,
        docCanvas: {},
        docImg: {},
        docA: {},
    });
    onMounted(() => {
        // 未挂载在dom中，故destroyed无须配置为null
        state.docCanvas = document.createElement('canvas');
        state.docImg = document.createElement('img');
        state.docA = document.createElement('a');
    });

    function handleClickDownload(file) {
        const src = file.url;
        const { canvas, img } = state;
        // 跨域图片无法使用a download 下载（默认会在打开图片）
        // 跨域图片（后端未设置Access-Control），也需要允许跨域请求
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, img.width, img.height);
            canvas.toBlob(blob => {
                const link = state.docA;
                link.href = URL.createObjectURL(blob);
                link.download = new Date().getTime();
                link.click();
            }, 'image/png');
        };
        img.setAttribute('crossOrigin', 'Anonymous');
        img.src = src;
    }
    return {
        handleClickDownload,
    };
}
export default defineComponent({
    name: 'ProUploadImage',
    components: {
        ElementUpload: Upload,
        IconGeneralAddItem,
    },
    props: {
        modelValue: {
            type: [String, Array, Object],
            default: '',
        },
        // 限制图片宽高
        limitWidth: {
            type: [String, Number],
            default: '',
        },
        limitHeight: {
            type: [String, Number],
            default: '',
        },
        // 设置宽高比限制，scale: '5:4'
        // limitWidth与limitHeight，要同时设置，或不设置，否则无意义
        scale: {
            type: String,
            default: '',
        },
        // true, 则limitWidth与limitHeight为图片的最大宽高，可以小于
        isMaxLimit: {
            type: [String, Boolean],
            default: false,
        },
        // 最大尺寸,单位k
        maxSize: {
            type: [String, Number],
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        // 是否为详情页面
        isDetail: {
            type: Boolean,
            default: false,
        },
        limit: {
            type: Number,
            default: 1,
        },
        // 图片资源可能通过第三方接口获取
        getUrlAction: {
            type: String,
            default: '',
        },
        // 上传成功后，后端返回数据，视频地址的key
        urlKey: {
            type: String,
            default: 'url',
        },
        uploadText: {
            type: String,
            default: '',
        },
        responseCallback: {
            type: Function,
            default: () => {},
        },
    },
    emits: ['file-data', 'update:modelValue'],
    setup(props, ctx) {
        const uploadRef = ref<any>(null);
        const state = reactive({
            uploadClass: '', // 限制上传一个，隐藏上传后的可上传按钮
            fileList: [], // 缓存fileList
            uploadSuccessTag: false, // 标示是否手动上传
            initIndex: 0,
            isSlideShow: false,
        });
        const limitComposite = limitComposition(props);
        const downLoadComposite = downLoadComposition();
        // default
        const bindProps = computed(() => {
            const { limit } = props;
            return {
                limit,
                accept: 'image/*',
                multiple: limit > 1,
                ...ctx.attrs,
            };
        });
        const previewList = computed(() => {
            const data = props.modelValue;
            if (!bindProps.value.multiple) {
                // 确实为多选
                return [data[props.urlKey] || data]; // 只放入url
            }
            return [];
        });
        function handleUploadSuccess(res, file, fileList) {
            if (!res) {
                // 兼容外部通过 http-server 方式上传的情况
                return;
            }
            const response = res;
            const { responseCallback } = props;
            if (responseCallback && typeof responseCallback === 'function') {
                const callbackRes = responseCallback(res);
                if (!callbackRes && typeof callbackRes === 'boolean') {
                    uploadRef.value?.clearFiles();
                    emit('update:modelValue', '');
                    return;
                }
            }
            const { data } = response;
            // 兼容data.url 与 data = 'xxxx'
            const url = data?.[props.urlKey] || data;
            state.uploadSuccessTag = true;
            if (bindProps.value.multiple && Array.isArray(props.modelValue)) {
                // 确实为多选
                ctx.emit('update:modelValue', [...props.modelValue, url]);
            } else {
                ctx.emit('update:modelValue', url);
            }
            ctx.emit('file-data', res.data);
            state.fileList = fileList;
            // 等value同步后，再设置样式
            nextTick(() => {
                setUploadClass();
            });
        }

        function handleUploadError() {
            Message.error('图片上传接口出错！');
        }
        function handleUploadExceed() {
            Message.error(`超过最大上传文件数量（${props.limit}）限制！`);
        }
        function handleUploadRemove(file, fileList) {
            state.fileList = fileList;
        }

        function handleClickRemove(file) {
            state.uploadSuccessTag = true;
            uploadRef.value.handleRemove(file);
            if (bindProps.value.multiple) {
                const index = getImgIndex(file);
                props.modelValue.splice(index, 1);
            } else {
                if (Object.prototype.toString.call(props.modelValue) === '[object Object]') {
                    ctx.emit('update:modelValue', {});
                }
                if (typeof props.modelValue === 'string') {
                    ctx.emit('update:modelValue', '');
                }
                state.fileList = [];
            }
            state.uploadClass = '';
        }
        // 获取图片index
        function getImgIndex(file) {
            if (typeof file === 'number') {
                return file;
            }
            // response.data 是 el-upload 返回file值
            // file.url 是setFileList 自定义的
            const url = (file && file.response && file.response.data) || file.url;
            return bindProps.value.multiple ? props.modelValue.indexOf(url) : 0;
        }
        function setUploadClass() {
            const { modelValue, limit, urlKey } = props;
            if (!bindProps.value.multiple && modelValue) {
                if (Object.prototype.toString.call(modelValue) === '[object Object]' && value[urlKey]) {
                    state.uploadClass = 'fill-upload';
                }
                if (Array.isArray(modelValue) && value.length === limit) {
                    state.uploadClass = 'fill-upload';
                }
                if (typeof modelValue === 'string') {
                    state.uploadClass = 'fill-upload';
                }
            }
        }
        function handlePicturePreview(file) {
            state.initIndex = getImgIndex(file);
            state.isSlideShow = true;
        }
        function setFileList() {
            const { modelValue, getUrlAction } = props;
            state.fileList = [{ url: `${getUrlAction}${modelValue}` }];
        }
        watch(
            () => props.modelValue,
            val => {
                if (state.uploadSuccessTag) {
                    return;
                }
                if (val) {
                    setUploadClass();
                    setFileList();
                }
            },
            { deep: true, immediate: true }
        );
        return {
            ...toRefs(state),
            uploadRef,
            bindProps,
            previewList,
            handleUploadError,
            handleUploadExceed,
            handleUploadRemove,
            handleUploadSuccess,
            handleClickRemove,
            handlePicturePreview,
            ...limitComposite,
            ...downLoadComposite,
        };
    },
});
</script>

<style scoped lang="scss">
:deep(.element-upload) {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    &:focus,
    &:hover {
        .icon-wrapper {
            color: #326bfb;
        }
        .upload_text {
            color: #326bfb;
        }
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
}
.fill-upload {
    // 直接display:none会导致样式问题
    :deep(.element-upload) {
        width: 0;
        border: none;
        opacity: 0;
    }
}
.el-upload__tip {
    font-size: 12px;
}
:deep(.element-upload-list) {
    &:has(li) + .element-upload {
        display: none;
    }
    .element-upload-list__item {
        transition: none !important;
        &.is-success {
            border: none;
            background: #ebecf0;
        }
        .element-upload-list-thumbnail {
            width: 100%;
            height: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
    }
    .thumbnail-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}
</style>
