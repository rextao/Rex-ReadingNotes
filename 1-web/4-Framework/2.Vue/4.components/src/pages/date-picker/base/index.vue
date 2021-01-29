<template>
    <div>
        <p>限制开始结束时间</p>
        <co-date-picker
            :pick-start-time="Date.now() - 3 *3600*24 *1000"
            :pick-end-time="Date.now()"
        ></co-date-picker>
        <p>限制只能选5天</p>
        <co-date-picker
                :pick-time-num="5"
        ></co-date-picker>
        <p>绑定到form的不同字段</p>
        <co-date-picker
                v-model="searchForm"
                bind-start-value="start"
                bind-end-value="end"
        ></co-date-picker>
        searchForm: {{searchForm}}
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import {
    CoDatePicker,
} from './../../../components/base';

export default defineComponent({
    components: {
        CoDatePicker,
    },
    setup() {
        const state = reactive({
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
