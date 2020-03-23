<template>
    <div class="index">
        <ks-el-form
                ref="form"
                :model="searchForm"
                inline
                :rules="rules"
        >
            {{{_table.forms.template}}}
        </ks-el-form>
        <{{business.name}}-table-list
            :data="list"
            @reload="handlePageSearch"
        ></{{business.name}}-table-list>
        <pagination
            class="page"
            ref="page"
            :config.sync="page"
            @load="handlePageSearch"
        ></pagination>
    </div>
</template>

<script>
import {
    Button,
    {{_table.forms.imports}}
} from '@ks/ks-element-ui';
import Pagination from '@/components/sp-pagination';
import {{_table.componentName}}TableList from './components/{{business.name}}-table-list';
import service from './service';
import { PAGE_INFO } from './const';

export default {
    name: '{{business.path}}',
    components: {
        KsElButton: Button,
        {{_table.forms.components}}
        {{_table.componentName}}TableList,
        Pagination,
    },
    data() {
        return {
            list: [],
            page: PAGE_INFO,
            searchForm: {{{_table.forms.searchForm}}}
        };
    },
    methods: {
        async handlePageSearch(page) {
            if (page) {
                this.page.current = page;
            }
            const { data } = await service.xxxxx({});
            this.list = data;
        },
    }
};
</script>

<style scoped lang="less">
.index {
    margin: 15px;
    .page {
        text-align: center;
    }
}
</style>
