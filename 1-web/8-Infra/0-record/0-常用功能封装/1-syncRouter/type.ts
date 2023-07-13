import { Ref, ReactiveEffect } from 'vue';

export type IObject = {
    [key: string]: any;
};

export type IUseSyncRouterBaseData = IObject | ReactiveEffect | Ref;

export type IUseSyncRouterData = IUseSyncRouterBaseData | IUseSyncRouterBaseData[];
