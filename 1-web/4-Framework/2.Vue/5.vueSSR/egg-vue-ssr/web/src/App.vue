<template>
    <div>
        <div @click='handleClick'>{{msg}}</div>
        <button @click="handleClick">asdasfdasfdasfd</button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                msg: 'asdfasdf'
            };
        },
        created(){
            this.msg = 'this is created'
        },
        mounted(){
            this.msg = 'this is mounted'
        },
        methods: {
            handleClick() {
                console.log('name');
                this.msg += '11111';
            }
        }
    }
</script>
