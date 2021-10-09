<template>
    <co-tooltip
        :line-clamp="1"
        v-bind="$attrs"
        content="copy"
        placement="top"
    >
        <span
            @click="copy(value)"
            class="el-icon-copy-document"
        ></span>
    </co-tooltip>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Message } from 'element-ui';
import {
    CoTooltip,
} from './index';

export const copy = value => {
    if (!value) { Message.error('No copy content'); return; }
    try {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', value);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        document.body.removeChild(input);
        Message.success('successful copy');
    } catch (error) {
        Message.error('fail copy');
    }
};

export default defineComponent({
    name: 'copy-icon',
    components: {
        CoTooltip,
    },
    props: {
        value: {
            type: [String, Number],
            default: '',
        },
    },
    setup() {
        return {
            copy,
        };
    },
});
</script>
<style lang="less" scoped>
.ks-tooltip {
    vertical-align: bottom;
    display: -webkit-inline-box !important;
}
.icon-fuzhi {
    cursor: pointer;
    color: #BBBDBF;
    &:hover {
        color: #327dff;
    }
}
</style>
