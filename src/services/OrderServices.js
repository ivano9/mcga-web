import { createBaseServices } from "@/core/BaseServices"
import { createOrderModel } from "@/models"

export const createOrdersServices = () => {
    const baseServices = createBaseServices()

    const getOrdersList = () => {
        const url = `${baseServices._api}/orders`
        return fetch(baseServices.newRequestGet(url)).then(async res => {
            const data = await res.json()
            if (!data.code) {
                const orders = data.data.map(data => createOrderModel(data))
                return orders
            } else
                throw baseServices.handleError(data)
        }).catch(err => {
            throw baseServices.handleError(err)
        })
    }

    const createOrder = (order) => {
        const url = `${baseServices._api}/orders`
        return FetchTokenInstance(baseServices.newRequestPost(url, order)).then(async res => {
            const data = await res.json()
            if (!data.code) return
            else throw baseServices.handleError(data)
        }).catch(err => {
            throw baseServices.handleError(err)
        })
    }

    const updateOrder = (id, order) => {
        const url = `${baseServices._api}/orders/${id}`
        return FetchTokenInstance(baseServices.newRequestPatch(url, order)).then(async res => {
            const data = await res.json()
            if (!data.code) return
            else throw baseServices.handleError(data)
        }).catch(err => {
            throw baseServices.handleError(err)
        })
    }

    const deleteOrder = (id) => {
        const url = `${baseServices._api}/orders/${id}`
        return FetchTokenInstance(baseServices.newRequestDelete(url))
          .catch(err => {
            throw baseServices.handleError(err)
          })
    }

    return {
        ...baseServices,
        getOrdersList,
        createOrder,
        updateOrder,
        deleteOrder
    }
}
