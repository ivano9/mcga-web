<script setup>
import { ref, watch, toRefs } from 'vue'
import { createOrdersServices, createAuthServices } from '@/services';
import { createOrderModel } from '@/models'
import BaseAlert from './BaseAlert.vue';

const loadingButton = ref(false)
const isEditModal = ref(false)
const alertComponent = ref()
const authServices = createAuthServices()
const ordersServices = createOrdersServices()

const props = defineProps({
    dataForm: Object, default() {
        return createOrderModel({})
    }
})

const { dataForm } = toRefs(props)

const emits = defineEmits(['uploadOrders'])
const form = ref({})
const newOrder = createOrderModel({})

watch(dataForm, newValue => {
    Object.assign(form.value, newValue)
    Object.assign(newOrder, createOrderModel(newValue))
}, { deep: true })

const saveOrder = async () => {
    loadingButton.value = true
    try {
        if (form.value._id){
            await ordersServices.updateOrder(form.value._id, newOrder.prepareToUpdateOrder(form.value))
            }
        else
            await
              ordersServices.createOrder(newOrder.prepareToSaveOrder(form.value))
        form.value = createOrderModel({})
    } catch (e) {
      alertComponent.value.showAlertWithMessage(e.message)
    } finally {
        loadingButton.value = false
        isEditModal.value = false
        document.getElementById('create_oreder').close()
        emits('uploadOrders')
    }
}

const resetValuesForNewOrder = () => {
    form.value = createOrderModel({})
    isEditModal.value = true
}

const requiredFields =() => {
  const {
    address,
    deliverer,
    state,
    customerName,
    customerPhone,
    deliverType,
    amount} = form.value
  return  address &&  deliverer && state && customerName && customerPhone &&  deliverType && amount
}

</script>

<template>
    <BaseAlert ref="alertComponent" />
    <button class="btn btn-ghost" onclick="create_oreder.showModal()" @click="resetValuesForNewOrder"
        v-if="authServices.isAdmin() && authServices.loggedIn()">New Order</button>
    <dialog id="create_oreder" class="modal">
        <div class="modal-box">

            <h3 class="font-bold text-xl mb-5">Order</h3>
            <button class="btn btn-block btn-ghost btn-sm mb-5" v-if="!isEditModal" @click="isEditModal = true">Edit
                Order</button>

            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick="create_oreder.close()"
                @click="isEditModal = false">✕</button>
            <div class="modal-body">
                <div class="form-control w-full max-w-xs">
                    <label class="block">
                        <span
                            class="after:content-['*'] after:ml-0.5 after:text-red-400 block text font-medium text-slate-300">Address</span>
                    </label>
                    <label class='label-text text-sm' v-if="!isEditModal"><span>{{ form.address }}</span></label>
                    <input v-else v-model.tirm="form.address" type="text" placeholder="Type here the customer address"
                        class="input input-bordered input-sm w-full max-w-xs" />

                    <label class="block">
                        <span
                            class="after:content-['*'] after:ml-0.5 after:text-red-400 block text font-medium text-slate-300">Customer
                            Name</span>
                    </label>
                    <label class='label-text text-sm' v-if="!isEditModal"><span>{{ form.customerName }}</span></label>
                    <input v-else v-model.trim="form.customerName" type="text" placeholder="Type here the customer name"
                        class="input input-bordered input-sm w-full max-w-xs" />

                    <label class="block">
                        <span
                            class="after:content-['*'] after:ml-0.5 after:text-red-400 block text font-medium text-slate-300">Customer
                            Phone</span>
                    </label>
                    <label class='label-text text-sm' v-if="!isEditModal"><span>{{ form.customerPhone }}</span></label>
                    <input v-else v-model.trim="form.customerPhone" type="text" placeholder="Type here the customer phone"
                        class="input input-bordered input-sm w-full max-w-xs" />

                    <label class="block">
                        <span
                            class="after:content-['*'] after:ml-0.5 after:text-red-400 block text font-medium text-slate-300">Select
                            deliverer</span>
                    </label>
                    <label class='label-text text-sm' v-if="!isEditModal"><span>{{ form.deliverer }}</span></label>
                    <select v-else class="select select-sm select-bordered" placeholder="Select deliverer in the list"
                        v-model="form.deliverer">
                        <option value="DELIVERER-A">Deliverer A</option>
                        <option value="DELIVERER-B">Deliverer B</option>
                        <option value="DELIVERER-C">Deliverer C</option>
                    </select>

                    <label class="block">
                        <span
                            class="after:content-['*'] after:ml-0.5 after:text-red-400 block text font-medium text-slate-300">Select
                            delivery type</span>
                    </label>
                    <label class='label-text text-sm' v-if="!isEditModal"><span>{{ form.deliverType }}</span></label>
                    <select v-else class="select select-sm select-bordered" placeholder="Select deliver type in the list"
                        v-model="form.deliverType">
                        <option value="NON-CONTACT">Non contact</option>
                        <option value="IN-CONTACT">In contact</option>
                    </select>


                    <label class="block">
                        <span
                            class="after:content-['*'] after:ml-0.5 after:text-red-400 block text font-medium text-slate-300">Select
                            State</span>
                    </label>
                    <label class='label-text text-sm' v-if="!isEditModal"><span>{{ form.state }}</span></label>
                    <select v-else class="select select-sm select-bordered" placeholder="Select state in the list"
                        v-model="form.state">
                        <option value="CANCELED">CANCELLED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="ON THE WAY">ON THE WAY</option>
                        <option value="PREPARING">PREPARING</option>
                    </select>


                    <label class="block">
                        <span
                            class="after:content-['*'] after:ml-0.5 after:text-red-400 block text font-medium text-slate-300">Amount</span>
                    </label>
                    <label class='label-text text-sm' v-if="!isEditModal"><span>{{ form.amount }}</span></label>
                    <input v-else v-model.number.trim="form.amount" type="number" placeholder="Type here the amout of items"
                        class="input input-sm input-bordered w-full max-w-xs" />

                </div>
            </div>
            <div class="modal-action" v-if="isEditModal">
                <div><button class="btn btn-ghost" @click="saveOrder" :disabled="loadingButton || !requiredFields() "> <span v-if="loadingButton"
                            class="loading loading-spinner"></span> Save</button></div>
            </div>
        </div>
    </dialog>
</template>
