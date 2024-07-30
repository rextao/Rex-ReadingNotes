<template>
    <div>
        <span v-for="(item, v) in options" class="checkbox-input">
            <component
                :is="'element-' + widget"
                :key="item[val] || v"
                v-model="model[item.key][type]"
                :label="item[val]"
                :disabled="item.disabled || $attrs.disabled"
                @change="onChange($event, item)">
                {{ isK18n ? $k18n({ desc: k18nDesc, text: item[label] }) : item[label] }}
                <ProTooltip v-if="tooltips[v] || item.tooltip" :content="k18n(tooltips[v] || item.tooltip)" />
            </component>
            <template v-if="item.widget">
                <component
                    :is="item.widget.type || 'ProInput'"
                    v-bind="getWidgetProps(item.widget)"
                    v-model="model[item.key].value"
                    :disabled="item.widget.disabled || $attrs.disabled"
                    width="100px"
                    :class="widget + '-widget'" />
            </template>
        </span>
    </div>
</template>

<script lang="ts">
import { Checkbox, CheckboxGroup } from 'element';
import { computed, defineComponent, PropType, inject, reactive } from 'vue';
import { elFormEvents, ElFormItemContext, elFormItemKey, elFormEvents, ElFormItemContext, elFormItemKey } from 'element/lib/element-form';
import { ProTooltip } from '@components/base/index';
import ProInput from './ProInput.vue';
import { isEmpty } from '@/components/proUtils/check';
import { getK18n } from '@/components/proUtils/get';

type TWidget = 'checkbox' | 'radio';
export default defineComponent({
    name: 'ProCheckbox',
    components: {
        ElementCheckboxGroup: CheckboxGroup,
        ElementCheckbox: Checkbox,
        ProInput,
        ProTooltip,
    },
    props: {
        isK18n: {
            type: Boolean,
            default: false,
        },
        k18nDesc: {
            type: String,
            default: '',
        },
        options: {
            type: Array,
            default: () => [],
        },
        label: {
            type: String,
            default: 'label',
        },
        val: {
            type: String,
            default: 'value',
        },
        modelValue: {
            type: Object,
            default: () => {},
        },
        widget: {
            type: String as PropType<TWidget>,
            default: 'checkbox',
        },
        validateEvent: {
            type: Boolean,
            default: true,
        },
        tooltips: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, ctx) {
        const k18n = getK18n();

        const elFormItem = inject(elFormItemKey, {} as ElFormItemContext);
        const type = computed(() => (props.widget === 'radio' ? 'checkValue' : 'checked'));
        const model = computed({
            get() {
                if (isEmpty(props.modelValue) || JSON.stringify(props.modelValue) === '{}') {
                    console.error('请检查v-module传入的值， 需要传入一个对像');
                }
                return props.modelValue;
            },
            set(val) {
                ctx.emit('update:modelValue', val);
                ctx.emit('change', val);
                if (props.validateEvent) {
                    elFormItem.formItemMitt?.emit(elFormEvents.formChange, val);
                }
            },
        });
        const onChange = (val, item) => {
            if (props.widget === 'radio') {
                Object.keys(model.value).forEach(key => {
                    if (key === item.key) {
                        model.value[key].checked = true;
                    } else {
                        model.value[key].checked = false;
                        model.value[key].checkValue = -1;
                    }
                });
                // ctx.emit('update:modelValue', model);
                ctx.emit('change', model);
                if (props.validateEvent) {
                    elFormItem.formItemMitt?.emit(elFormEvents.formChange, model);
                }
            }
        };

        const WIDGETDEFAULTPROPS = {
            style: { width: '100px', 'margin-left': '4px' },
        };
        const getWidgetProps = widget => {
            const { type, disabled, ...attrs } = widget;
            return { ...WIDGETDEFAULTPROPS, ...attrs };
        };
        return {
            model,
            type,
            getWidgetProps,
            onChange,
            k18n,
        };
    },
});
</script>
<style lang="scss">
.checkbox-input {
    margin-right: 12px;
}
.radio-widget {
    position: relative;
    top: -3px;
}
:deep(.element-form-item__content) {
    height: 20px;
    line-height: 20px;
}
:deep(.element-checkbox) {
    height: 20px;
    line-height: 20px;
}
</style>
