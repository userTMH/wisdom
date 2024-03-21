import Vue from "vue";
import store from "@/store";

Vue.directive("auth-btn", {
  inserted(e, binding) {
    // console.log(e);
    // console.log(binding);
    const val = binding.value;
    console.log(val);
    const liat = store.state.user.userinfo.permissions;
    console.log(liat);
    const valid = liat.includes(val);
    // console.log(valid);
    if (valid) {
      e.parentNode.removeChild(e);
    }
  },
});
