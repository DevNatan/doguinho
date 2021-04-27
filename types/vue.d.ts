import Vue from "vue";
import { Doguinho } from "./index";

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