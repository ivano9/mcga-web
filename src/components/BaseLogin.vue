<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createAuthServices } from '@/services';
import { useAuth } from "@/stores/auth.js";
import BaseAlert from './BaseAlert.vue';


const router = useRouter()
const authServices = createAuthServices()
const loadingButton = ref(false)
const authStore = useAuth()
const alertComponent = ref()

const formLogin = ref({
    email: '',
    password: ''
})

const login = async () => {
    loadingButton.value = true
    try {
        const res = await authServices.login(formLogin.value)
        if (res.access_token) {
            authStore.scope = res.scope
            authStore.token = res.access_token
            authStore.expires = res.expires_in
            return router.push({ name: 'dashboard' })
        }
        else {
          alertComponent.value.showAlertWithMessage(res.message)
        }
    } catch (e) {
        alertComponent.value.showAlertWithMessage(e.message)
    } finally {
        loadingButton.value = false
    }
}

</script>

<template>
    <BaseAlert ref="alertComponent" />
    <div class="col-start-2 card w-96 bg-base-100 shadow-xl image-full">
        <figure><img src="@/assets/images/Untitled.jpeg" alt="Log in our orders" /></figure>
        <div class="card-body mt-5">
            <label class="block">
                <span class="block text font-medium text-slate-300">Email</span>
            </label>
            <input type="text" placeholder="Type here your email" class="input input-bordered input-sm w-full max-w-xs"
                v-model.trim="formLogin.email" />
            <label class="block">
                <span class="block text font-medium text-slate-300">Password</span>
            </label>
            <input type="password" placeholder="Type here your password"
                class="input input-bordered input-sm w-full max-w-xs" v-model.trim="formLogin.password" />
            <div class="card-actions justify-end">
                <button class="btn btn-ghost" @click="login" :disabled="loadingButton">Log in</button>
            </div>
        </div>
    </div>
</template>


<style></style>
