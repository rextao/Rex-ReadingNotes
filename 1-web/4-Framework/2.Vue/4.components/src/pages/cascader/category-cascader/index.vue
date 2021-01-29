<template>
    <co-cascader
        v-model="model"
        hide-radio
        clearable
        filterable
        popper-class="category_cascader_popper__class"
        :props="{
            checkStrictly: true,
            expandTrigger: 'hover',
        }"
        :options="DATA_CATEGORY_OPTIONS"
        @change="handleChange"
    >
        <template #default="{ node, data }">
            <div
                ref="starCardRef"
                class="star_card"
                v-if="data.label === '全部'"
            >
                <span class="title">收藏</span>
                <div v-if="hasStar">
                    <div
                        v-for="(item,i) in starList"
                        :class="['item', join(model) === item ? 'on': '']"
                        @click="handleClickItemLabel(item)"
                        :key="i"
                    >
                        <span>
                            {{item}}
                            <span
                                @click.stop="handleClickStar(item)"
                                class="icon el-icon-star-on on"
                            ></span>
                        </span>
                    </div>
                </div>
                <div class="item" v-else>
                    暂无收藏
                </div>
                <span class="title">全部</span>
            </div>
            <div
                class="node_star__item"
                @click="handleClickItemLabel(node,data)"
            >
                {{data.label}}
                <span
                    @click.stop="handleClickStar(node,data)"
                    :class="[
                        'icon',
                        'el-icon-star-on',
                        isInstarList(node) ? 'on' : ''
                    ]"
                ></span>
            </div>
        </template>
    </co-cascader>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from '@vue/composition-api';
import { DATA_CATEGORY_OPTIONS, LOCAL_STORAGE_KEY } from './const';
import {
    CoCascader,
} from './../../../components/base';
/*************************收藏功能的 cascader ***********************************/
// 1. 注： star_card 样式，是hack方式， 在 全部（DATA_CATEGORY_All）上方渲染
//        由于一二级面板外围上边界在同一高度，故未使用 cascader-panel
// 2. 通过padding-top 与 position:absolute 将star_card 放置位置
// 3. starList存储  一级/二级， 以 / 分隔 的一二级数据
// 4. 无类似使用，未拆为单独组建，和业务产品设计耦合较强
interface ICoProps {
    value?: string;
}
interface IStarState {
    ksScrollbarFirstMenuEl: any;
}
interface IState {
    starList: Array<string>;
}
function starControl(state: IState, model: any) {
    const starCardRef = ref<any>(null);
    const itemHeight = 32; // 收藏每个item高度，注意与样式保持一致
    const baseHeight = 98; //
    const starState = reactive<IStarState>({
        // 第一个面板dom
        ksScrollbarFirstMenuEl: {},
    });
    const hasStar = computed(() => {
        return state.starList.length > 0;
    });

    // 收藏栏显示
    function join(path: Array<any>) {
        return path.join('/');
    }
    function isInstarList(node: any) {
        const label = join(node.path);
        return state.starList.includes(label);
    }
    // 设置样式
    function setStyle(num = 0) {
        const paddingTop = baseHeight + num * itemHeight;
        const top = -baseHeight - num * itemHeight;
        starState.ksScrollbarFirstMenuEl.style.paddingTop = `${paddingTop}px`;
        starCardRef.value.style.top = `${top}px`;
    }
    function handleClickStar(node: any) {
        let label = '';
        if (typeof node === 'string') {
            label = node;
        } else {
            const { path } = node;
            label = join(path);
        }
        const index = state.starList.indexOf(label);
        if (index !== -1) {
            state.starList.splice(index, 1);
        } else {
            state.starList.unshift(label);
        }
        const starListLen = state.starList.length;
        if (starListLen >= 1) {
            setStyle(starListLen - 1);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, state.starList.join());
    }

    onMounted(() => {
        const categoryCascaderPopperEl: any = document.querySelector('.category_cascader_popper__class');
        starState.ksScrollbarFirstMenuEl = categoryCascaderPopperEl.querySelector('.el-scrollbar .el-cascader-menu__list');
        const storageStar = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storageStar) {
            state.starList = storageStar.split(',');
            model.value = [state.starList[0]];
            setStyle(state.starList.length - 1);
        } else {
            setStyle();
        }
    });

    return {
        starCardRef,
        hasStar,
        join,
        isInstarList,
        handleClickStar,
    };
}
export default defineComponent<ICoProps>({
    name: 'category-cascader',
    components: {
        CoCascader,
    },
    props: {
        value: {
            type: String,
            default: '',
        },
    },
    setup(props, ctx) {
        const state = reactive<IState>({
            starList: [], // 收藏列表
        });
        const model = computed({
            get() {
                const dataCategory = props.value;
                return dataCategory && dataCategory.split(',') || ['全部'];
            },
            set(val: Array<string>) {
                ctx.emit('input', val.join());
            },
        });
        function handleChange(val: any) {
            ctx.emit('change', val);
        }
        function handleClickItemLabel(node: any) {
            let result = '';
            if (typeof node === 'string') {
                // 数据使用/ 分隔，但提交数据需要是逗号分隔
                result = node.replace('/', ',');
            } else {
                result = node.path.join();
            }
            ctx.emit('input', result);
        }
        const starControlFunc = starControl(state, model);

        return {
            ...toRefs(state),
            ...starControlFunc,
            DATA_CATEGORY_OPTIONS,
            model,
            handleChange,
            handleClickItemLabel,
        };
    },
});
</script>
<style lang="less">
.category_cascader_popper__class {
    .star_card {
        position: absolute;
        width: 100%;
        margin-left: -12px;
        .title {
            opacity: 0.4;
            font-size: 12px;
            color: #000;
            padding-left: 12px;
        }
        .item {
            height: 32px;
            font-size: 14px;
            padding-left: 12px;
            &.on {
                color: #000;
            }
        }

    }
    .node_star__item {
        position: absolute;
        width: 100%;
        top: 0;
    }
    .el-cascader-node:hover {
        .el-icon-star-on {
            display: inline-block;
        }
    }
    .el-icon-star-on {
        margin-left: 8px;
        margin-right: 15px;
        display: none;
        &.on {
            display: inline-block;
            color: #ffbb45;
        }
    }
    li {
        .el-radio {
            display: none;
        }
    }
    .el-cascader-menu__wrap.el-scrollbar__wrap {
        height: 500px;
    }
    /*.el-scrollbar:first-child {*/
    /*    .el-cascader-menu__list {*/
    /*        padding-top: 98px;*/
    /*    }*/
    /*}*/
}
</style>
