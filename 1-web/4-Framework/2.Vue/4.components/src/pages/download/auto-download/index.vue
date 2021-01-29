<template>
    <div>
        <h1>download-drawer</h1>
        <button @click="showDrawer = true">点击按钮</button>
        <download-drawer
            v-model="showDrawer"
            :list="videoList"
        ></download-drawer>
    </div>
</template>

<script>
import DownloadDrawer from './download-drawer';
export default {
    name: "download-index",
    components: {
        DownloadDrawer,
    },
    data() {
        return {
            showDrawer: false,
            videoList: [
                {
                    photoId: 1,
                    userName: '11111'
                },
                {
                    photoId: 2,
                    userName: '2222'
                },
            ]
        };
    },
};
</script>
