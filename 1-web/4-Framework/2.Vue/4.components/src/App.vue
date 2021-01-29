<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <el-menu
                default-active="2"
                class="el-menu-vertical-demo">
          <template v-for="(item, index) in routes">
            <el-submenu :index="item.name" :key="item.name">
              <template slot="title">
                <span>{{item.name}}</span>
              </template>
              <template v-if="item.children && item.children.length > 0">
                <el-menu-item
                        v-for="(subItem, subIndex) in item.children"
                        :key="`${index}-${subIndex}`"
                        :index="`${index}-${subIndex}`"
                >
                    <span slot="title">
                      <router-link :to="{path: `${item.path}/${subItem.path}`}">{{subItem.name}}</router-link>
                    </span>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { routes } from './router/index';
  interface ICoProps {
    value?: string;
  }
export default defineComponent<ICoProps>({
    setup() {
        return {
            routes,
        };
    }
});
</script>
