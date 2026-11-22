/// <reference types="vite/client" />
import "@vue/runtime-dom";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@vue/runtime-dom" {
  interface SVGAttributes {
    strokeWidth?: any;
    strokeLinecap?: any;
    strokeLinejoin?: any;
  }
}
