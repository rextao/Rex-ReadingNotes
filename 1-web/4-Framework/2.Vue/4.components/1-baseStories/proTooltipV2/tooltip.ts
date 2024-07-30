export const tooltipProps = {
    // 设置字数省略模式
    lineClamp: {
        type: [Number, String],
        default: undefined,
    },
    content: {
        type: [Number, String],
        default: '',
    },
    /**
     * lineClamp单行时使用，设置tooltip最大宽度，文案多于此宽，会自动省略+hover tooltip
     * 如果不设置，组件渲染时，会计算tooltip.disabled = true, element-tooltip不会渲染
     */
    maxWidth: {
        type: String,
        default: '155px',
    },
    // 弹窗宽度，需px单位
    contentWidth: {
        type: String,
        default: '250px',
    },
    // 内置的快捷icon模式，解决常用的icon+tooltip
    // 其他icon，可以直接slot方式
    icon: {
        type: String,
        default: 'default',
    },
    // 当文字长度小于等于len（粗略计算），会禁用tooltip
    // 通过mouseEnter计算 text.value.scrollWidth > text.value.offsetWidth;会精准，
    len: {
        type: Number,
        default: 0,
    },
    // icon的size
    size: {
        type: [String, Number],
        default: '',
    },
    // 因为开始设计时size是icon大小，但tooltip可以传入size设置尺寸 medium / small / mini
    // 只好用tooltipSize表示尺寸
    tooltipSize: {
        type: String,
        default: 'medium',
        validator: size => ['medium', 'small', 'mini'].includes(size),
    },
    color: {
        type: [String, Number],
        default: '',
    },
    disabled: {
        type: [String, Boolean],
        default: '',
    },
    // 点击复制content内容
    clickCopyContent: {
        type: Boolean,
        default: false,
    },
    // 是否对content进行多语言处理，默认false
    isK18n: {
        type: Boolean,
        default: false,
    },
};
