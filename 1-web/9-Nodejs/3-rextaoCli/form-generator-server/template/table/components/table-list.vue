<template>
    <div>
        <co-table-list
            :columns="TABLE_CONFIG"
            :data="data"
        >
            {{#each tableList.slot}}
            <template #{{this}}="{ row }">
                <ks-el-button type="text" @click="handelBtnClick(row)">
                    {{{{raw}}}}
                    {{row.title}}
                    {{{{/raw}}}}
                </ks-el-button>
            </template>
            {{/each}}
        </co-table-list>
    </div>
</template>

<script>
import {
    Button,
} from '@ks/ks-element-ui';
import CoTableList from '@/components/co-table-list';
import { TABLE_CONFIG } from './../const';
export default {
    name: '{{business.name}}-table-list',
    components: {
        KsElButton: Button,
        CoTableList,
    },
    props: {
        data: {
            type: Array,
            default: () => []
        },
    },
    async created() {
        this.TABLE_CONFIG = TABLE_CONFIG;
    },
    methods: {
        handelBtnClick(row) {
            console.log(row);
        },
    },
};
</script>
