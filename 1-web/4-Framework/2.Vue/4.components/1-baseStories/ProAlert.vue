<template>
    <element-alert v-bind="bindProps" class="pro_alert" :class="[type]">
        <template v-if="$slots.title || type === typeEnum.tip" #title>
            <slot name="title">
                <div class="alert_content">
                    <IconGeneralTips color="#AEAFB2" class="mr-4" />
                    {{ bindProps?.title }}
                </div>
            </slot>
        </template>
        <template v-if="$slots.default" #default>
            <slot> </slot>
        </template>
    </element-alert>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { IconGeneralTips } from '@kibt/pro-icons';
import { getK18nValue } from '@components/proUtils';

enum typeEnum {
    tip = 'tip',
}
const attrs = useAttrs();
const props = defineProps({
    isK18n: {
        type: Boolean,
        default: true,
    },
    // 默认 tip，灰色，其他透传element-alert
    type: {
        type: String,
        default: 'tip',
    },
});
const bindProps = computed(() => {
    const { description, title } = attrs;
    const { type } = props;
    return {
        type,
        closable: false,
        ...attrs,
        description: getK18nResult(description),
        title: getK18nResult(title),
    };
});
function getK18nResult(text) {
    return getK18nValue(text, props);
}
</script>

<style scoped lang="scss">
.pro_alert {
    .alert_content {
        display: flex;
        align-items: center;
    }
    &.tip {
        background: #fafafa;
        color: #333333;
        :deep(.element-alert__icon) {
            color: #aeafb2;
        }
    }
    :deep(.element-alert__icon) {
        margin-right: 4px;
    }
}
</style>
