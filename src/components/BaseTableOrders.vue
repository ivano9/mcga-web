<script setup>
import { ref } from 'vue'
import { createOrdersServices } from '@/services'
import { formatDateFilter } from '@/utils'
import BaseAlert from './BaseAlert.vue';


const orders = ref([])
const loadingOrders = ref(false)
const error = ref({ message: '' })
const ordersServices = createOrdersServices()

const headers = [
  { title: 'Customer Name' },
  { title: 'Amout' },
  { title: 'Customer Phone' },
  { title: 'Delivery Type' },
  { title: 'Deliverer' },
  { title: 'Delivery Date' },
  { title: 'State' },
]

const loadOrders = async () => {
  loadingOrders.value = true
  try {
    orders.value = await ordersServices.getOrdersList()
  } catch (e) {
    error.value.message = e
  } finally {
    loadingOrders.value = false
  }
}


loadOrders()
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <BaseAlert v-if="error.message" :message="error.message" />
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th>#</th>
              <template v-for="({ title }, idx) in headers" :key="idx">
                <th>{{ title }}</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-for="(order, idx) in orders" :key="idx">
              <tr v-if="orders && !loadingOrders">
                <th>{{ idx + 1 }}</th>
                <td>{{ order.customerName }}</td>
                <td>{{ order.amount }}</td>
                <td>{{ order.customerPhone }}</td>
                <td>{{ order.deliverType }}</td>
                <td>{{ order.deliverer }}</td>
                <td>{{ formatDateFilter(order.deliveryDateTime) }}</td>
                <td>{{ order.state }}</td>
              </tr>
            </template>
            <tr v-if="loadingOrders">
              <td colspan="8" class="text-center"><span class="loading loading-dots loading-lg"></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
