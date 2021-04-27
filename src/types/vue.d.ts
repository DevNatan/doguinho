import Vue from "vue";
import { Doguinho } from "./app";

declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        doguinho?: Doguinho
    }
}

declare module "vue/types/vue" {
    interface Vue {
        $doguinho: Doguinho
    }
}