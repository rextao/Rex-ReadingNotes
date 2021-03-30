<template>
    <div>
        <p>2行自动省略</p>
        <button @click="content += '啊'">add汉字</button>
        <co-tooltip
            style="width: 200px;"
            :line-clamp="2"
            :content="content"
            content-width="100px"
        ></co-tooltip>
        <p> 问号形式 </p>
        <co-tooltip
            :content="content"
            content-width="100px"
        ></co-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import {
    CoTooltip,
} from './../../components/base';

export default defineComponent({
    components: {
        CoTooltip,
    },
    setup() {
        const state = reactive({
            content: '阿斯😆蒂😆芬.*&@#)$',
            searchForm: {
                start: '',
                end: '',
            }
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>
